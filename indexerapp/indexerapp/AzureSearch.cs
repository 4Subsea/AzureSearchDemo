using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using IndexerApp.Dsl;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;

namespace IndexerApp
{

    public class AzureSearch
    {
        private const string IdColumn = "id";

        private readonly Lazy<SearchServiceClient> _client;
        private IIndexesOperations Indexes => _client.Value.Indexes;

        public AzureSearch()
        {
            var httpClient = new HttpClientHandler();
            _client = new Lazy<SearchServiceClient>(() => new SearchServiceClient(Config.SearchServiceName, new SearchCredentials(Config.SearchApiKey), httpClient));
        }

        public bool IndexExist(string indexName)
        {
            return Indexes.Exists(IndexNamed(indexName));
        }

        public void DeleteIndex(string indexName)
        {
            var ix = IndexNamed(indexName);
            if (Indexes.Exists(ix))
                Indexes.Delete(ix);
        }

        public void CreateIndex(string name, IEnumerable<Field> fields, IEnumerable<ScoringProfile> scoringProfiles)
        {
            var indexName = IndexNamed(name);
            if (Indexes.Exists(indexName))
                throw new ArgumentException("Index '" + name + "' already exist");

            var allFields = fields.ToList();
            if (allFields.SingleOrDefault(f => f.Name.ToLowerInvariant() == IdColumn && f.IsKey) == null)
                throw new ArgumentException("No Key column defined", nameof(fields));

            var profiles = scoringProfiles.ToList();

            var definition = new Index
            {
                Name = indexName,
                Fields = allFields,
                ScoringProfiles = profiles
            };

            Indexes.Create(definition);
        }

        public int Index<TDocument>(string indexName, IEnumerable<TDocument> documents) where TDocument: class
        {
            var docs = documents;
            var actions = docs.Select(IndexAction.MergeOrUpload);
            var batch = IndexBatch.New(actions);
            if (!batch.Actions.Any())
                return 0;

            var results = IndexClientFor(indexName).Documents.Index(batch);
            //TODO: inspect for status = 207 indicating partial success
            if (results.Results.Any(r => !r.Succeeded))
                throw FormatStatusException(results);

            return results.Results.Count;
        }

        public void DeIndex(string indexName)
        {
            var sp = new SearchParameters
            {
                Select = new[] { "id" }
            };

            var ids = SearchWithContinuation(indexName, "", sp).Select(r => r.Document["id"].ToString()).ToList();
            if (ids.Count == 0)
                return;

            DeIndex(indexName, ids);
        }

        public void DeIndex(string indexName, IEnumerable<string> entityIds)
        {
            var actions = entityIds
                .Select(docId => new Document { { "id", docId } })
                .Select(IndexAction.Delete);
            var batch = IndexBatch.New(actions);
            if (!batch.Actions.Any())
                return;

            IndexClientFor(indexName).Documents.Index(batch);
        }

        public IEnumerable<SearchResult<TDocument>> Search<TDocument>(string indexName, int maxHits, string query, string filter, string scoringProfile, IEnumerable<ScoringParameter> scoringParameters)
            where TDocument : class 
        {
            var sp = new SearchParameters
            {
                Top = maxHits,
                Filter = filter,
                SearchMode = SearchMode.All,
                QueryType = QueryType.Full,
                ScoringProfile = scoringProfile,
                ScoringParameters = scoringParameters?.ToList()
            };

            return SearchWithContinuation<TDocument>(indexName, query, sp);
        }

        private IEnumerable<SearchResult<TDocument>> SearchWithContinuation<TDocument>(string indexName, string query, SearchParameters sp)
            where TDocument : class 
        {
            var index = IndexClientFor(indexName);
            var response = index.Documents.Search<TDocument>(query, sp);

            while (true)
            {
                foreach (var result in response.Results)
                {
                    yield return result;
                }

                var token = response.ContinuationToken;
                if (token == null)
                    break;

                response = index.Documents.ContinueSearch<TDocument>(token);
            }
        }

        private IEnumerable<SearchResult> SearchWithContinuation(string indexName, string query, SearchParameters sp)
        {
            var index = IndexClientFor(indexName);
            var response = index.Documents.Search(query, sp);

            while (true)
            {
                foreach (var result in response.Results)
                {
                    yield return result;
                }

                var token = response.ContinuationToken;
                if (token == null)
                    break;

                response = index.Documents.ContinueSearch(token);
            }
        }

        private SearchIndexClient IndexClientFor(string indexName)
        {
            return Indexes.GetClient(IndexNamed(indexName));
        }

        private static string IndexNamed(string indexName)
        {
            return indexName.ToLowerInvariant();
        }

        private static Exception FormatStatusException(DocumentIndexResult response)
        {
            const int maxMessagesToShow = 10;
            var message = "Index operation failed";
            var failedMessages = response
                .Results
                .Where(r => !r.Succeeded)
                .Select(r => r.ErrorMessage)
                .Distinct()
                .Take(maxMessagesToShow)
                .Aggregate("", (s, s1) => s + "\n" + s1);

            message += "\n" + failedMessages;
            return new InvalidOperationException(message);
        }
    }
}
