using System.Collections.Generic;
using System.Linq;
using Microsoft.Azure.Search.Models;

namespace IndexerApp.Dsl
{
    /// <summary>
    /// Common tasks associated with maintaining search indexes.
    /// </summary>
    public static class IndexExtensions
    {

        /// <summary>
        /// Delete old indexes given the version of <paramref name="index"/>. If <paramref name="keepPreviousVersion"/> the version previous to <paramref name="index"/> will be kept.
        /// </summary>
        public static void DeleteOldIndexes(this AzureSearch search, IndexName index, bool keepPreviousVersion = false)
        {
            // Look back at older indexes and delete any existing
            // We'll stop looking as soon as we do not find one version
            var previousVersion = index.Version - 1;
            var versionsToKeep = keepPreviousVersion ? 1 : 0;
            while (previousVersion >= 0)
            {
                var indexName = index.ForVersion(previousVersion);
                if (!search.IndexExist(indexName))
                    break;

                if (versionsToKeep > 0)
                {
                    versionsToKeep--;
                }
                else
                {
                    search.DeleteIndex(indexName);
                }
                previousVersion--;
            }
        }

        /// <summary>
        /// True if the specified index is exist.
        /// </summary>
        public static bool IndexExist(this AzureSearch search, IndexName index)
        {
            return search.IndexExist(index.FullName);
        }

        /// <summary>
        /// Delete the specified index.
        /// </summary>
        public static void DeleteIndex(this AzureSearch search, IndexName index)
        {
            search.DeleteIndex(index.FullName);
        }

        /// <summary>
        /// True if the specified index is outdated in terms of schema version or non-existence.
        /// </summary>
        public static bool IsIndexOutdated(this AzureSearch search, IndexName index)
        {
            return !search.IndexExist(index.FullName);
        }

        /// <summary>
        /// Create an index with the given fields.
        /// </summary>
        public static void CreateIndex(this AzureSearch search, IndexName index, params Field[] fields)
        {
            search.CreateIndex(index.FullName, fields, Enumerable.Empty<ScoringProfile>());
        }

        /// <summary>
        /// Create an index with the given fields.
        /// </summary>
        public static void CreateIndex(this AzureSearch search, IndexName index, IEnumerable<Field> fields, IEnumerable<ScoringProfile> scoringProfiles)
        {
            search.CreateIndex(index.FullName, fields, scoringProfiles);
        }

        /// <summary>
        /// Index a set of documents.
        /// </summary>
        /// <param name="search">The Azure Search service</param>
        /// <param name="index">Name of the index</param>
        /// <param name="documents">The documents to add or update to the index</param>
        public static int Index<TDocument>(this AzureSearch search, IndexName index, IEnumerable<TDocument> documents) 
            where TDocument : class
        {
            return search.Index(index.FullName, documents);
        }
    }
}