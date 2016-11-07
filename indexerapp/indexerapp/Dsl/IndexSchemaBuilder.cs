using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.Azure.Search.Models;
using Microsoft.Spatial;

namespace IndexerApp.Dsl
{
    public enum TextLanguage
    {
        English,
        Norwegian
    }

    public interface ISuggester<TDocument>
        where TDocument : class
    {
        ISuggester<TDocument> Field<TProperty>(Expression<Func<TDocument, TProperty>> property);
    }
    public interface IScoringProfile<TDocument>
        where TDocument : class
    {
        IScoringProfile<TDocument> WeightedText<TProperty>(Expression<Func<TDocument, TProperty>> property, double weight);
    }

    public class IndexSchema
    {
        public IndexName Name { get; set; }
        public IEnumerable<Field> Fields { get; set; }
        public IEnumerable<ScoringProfile> ScoringProfiles { get; set; }
        public IEnumerable<Suggester> Suggesters { get; set; }
    }

    public class IndexSchemaBuilder<TDocument>
        where TDocument : class
    {

        private class SuggesterBuilder : ISuggester<TDocument>
        {
            private readonly string _name;
            private readonly List<string> _suggesterFields;

            public SuggesterBuilder(string name)
            {
                _name = name;
                _suggesterFields = new List<string>();
            }

            public ISuggester<TDocument> Field<TProperty>(Expression<Func<TDocument, TProperty>> property)
            {
                _suggesterFields.Add(NameOf(property));
                return this;
            }

            public Suggester Build()
            {
                return new Suggester(_name, SuggesterSearchMode.AnalyzingInfixMatching, _suggesterFields);
            }
        }

        private class WeightedTextProfileBuilder : IScoringProfile<TDocument>
        {
            private readonly string _name;
            private readonly List<Tuple<string, double>> _textWeights = new List<Tuple<string, double>>();

            public WeightedTextProfileBuilder(string name)
            {
                _name = name;
            }

            public IScoringProfile<TDocument> WeightedText<TProperty>(Expression<Func<TDocument, TProperty>> property, double weight)
            {
                _textWeights.Add(new Tuple<string, double>(NameOf(property), weight));
                return this;
            }

            public ScoringProfile Build()
            {
                var fields = _textWeights.ToDictionary(tp => tp.Item1, tp => tp.Item2);
                return new ScoringProfile(_name) { TextWeights = new TextWeights(fields) };
            }
        }

        private readonly Dictionary<TextLanguage, AnalyzerName> _supportedLanguages = new Dictionary<TextLanguage, AnalyzerName>
            {
                {TextLanguage.English, AnalyzerName.EnMicrosoft},
                {TextLanguage.Norwegian, AnalyzerName.NbMicrosoft},
            };

        private readonly IndexName _indexName;
        private readonly List<Field> _fields;
        private readonly List<ScoringProfile> _scoringProfiles;
        private readonly List<Suggester> _suggesters;

        public IndexSchemaBuilder(IndexName indexName)
        {
            _indexName = indexName;
            _fields = new List<Field>();
            _scoringProfiles = new List<ScoringProfile>();
            _suggesters = new List<Suggester>();
        }

        public IndexSchema BuildSchema()
        {
            return new IndexSchema
            {
                Name = _indexName,
                Fields = _fields,
                ScoringProfiles = _scoringProfiles,
                Suggesters = _suggesters
            };
        }

        /// <summary>
        /// Create a "text weight" scoring profile for this index.
        /// </summary>
        public IndexSchemaBuilder<TDocument> ScoringProfile(string name, Action<IScoringProfile<TDocument>> configureScoringProfile)
        {
            var profileBuilder = new WeightedTextProfileBuilder(name);
            configureScoringProfile(profileBuilder);
            _scoringProfiles.Add(profileBuilder.Build());
            return this;
        }

        public IndexSchemaBuilder<TDocument> Suggester(string suggesterName, Action<ISuggester<TDocument>> configureSuggester)
        {
            var suggesterBuilder = new SuggesterBuilder(suggesterName);
            configureSuggester(suggesterBuilder);
            _suggesters.Add(suggesterBuilder.Build()); 
            return this;
        }

        public IndexSchemaBuilder<TDocument> Key<TProperty>(Expression<Func<TDocument, TProperty>> propertyName)
        {
            Add(new Field(NameOf(propertyName), DataType.String)
            {
                IsKey = true
            });
            return this;
        }

        public IndexSchemaBuilder<TDocument> StoredOnly<TProperty>(Expression<Func<TDocument, TProperty>> propertyName)
        {
            Add(Field(propertyName, DataType.String, false));
            return this;
        }

        public IndexSchemaBuilder<TDocument> Text<TProperty>(Expression<Func<TDocument, TProperty>> propertyName, bool searchable = true, bool filterable = false, TextLanguage? language = null, bool facetable = false, bool sortable = false)
        {
            Add(Field(propertyName, DataType.String, searchable, filterable, facetable, sortable, language));
            return this;
        }

        /// <summary>
        /// Text field containing ids (e.g. formatted guids). Normally, we want to filter on these but not search.
        /// </summary>
        public IndexSchemaBuilder<TDocument> TextId<TProperty>(Expression<Func<TDocument, TProperty>> propertyName, bool filterable = true)
        {
            Add(Field(propertyName, DataType.String, false, filterable));
            return this;
        }

        public IndexSchemaBuilder<TDocument> Integer<TProperty>(Expression<Func<TDocument, TProperty>> propertyName, bool filterable = true, bool facetable = false, bool sortable = false)
        {
            Add(Field(propertyName, DataType.Int32, false, filterable, facetable, sortable));
            return this;
        }

        public IndexSchemaBuilder<TDocument> Decimal<TProperty>(Expression<Func<TDocument, TProperty>> propertyName, bool filterable = true, bool facetable = false, bool sortable = false)
        {
            Add(Field(propertyName, DataType.Double, false, filterable, facetable, sortable));
            return this;
        }

        public IndexSchemaBuilder<TDocument> Boolean<TProperty>(Expression<Func<TDocument, TProperty>> propertyName, bool filterable = true, bool facetable = false, bool sortable = false)
        {
            Add(Field(propertyName, DataType.Boolean, false, filterable, facetable, sortable));
            return this;
        }

        public IndexSchemaBuilder<TDocument> DateTime(Expression<Func<TDocument, DateTimeOffset>> propertyName, bool filterable = true, bool facetable = false, bool sortable = false)
        {
            Add(Field(propertyName, DataType.DateTimeOffset, false, filterable, facetable, sortable));
            return this;
        }

        public IndexSchemaBuilder<TDocument> List<TProperty>(Expression<Func<TDocument, TProperty>> propertyName, bool searchable = true, bool filterable = false, bool facetable = false)
        {
            Add(Field(propertyName, DataType.Collection(DataType.String), searchable, filterable, facetable));
            return this;
        }

        public IndexSchemaBuilder<TDocument> Location<TProperty>(Expression<Func<TDocument, TProperty>> propertyName, bool filterable = false, bool sortable = false)
        {
            Add(Field(propertyName, DataType.GeographyPoint, false, filterable, false, sortable));
            return this;
        }

        private Field Field<TProperty>(Expression<Func<TDocument, TProperty>> propertyName, DataType dataType = null, bool searchable = true, bool filterable = false, bool facetable = false, bool sortable = false, TextLanguage? language = null)
        {
            return new Field(NameOf(propertyName), dataType ?? DataType.String)
            {
                IsSearchable = searchable,
                IsFilterable = filterable,
                IsFacetable = facetable,
                IsSortable = sortable,
                Analyzer = AsAnalyzer(language)
            };
        }

        private void Add(Field field)
        {
            _fields.Add(field);
        }

        private static string NameOf<TProperty>(Expression<Func<TDocument, TProperty>> expr)
        {
            return Property.NameOf(expr).ToLowerInvariant();
        }

        private AnalyzerName AsAnalyzer(TextLanguage? language)
        {
            if (language == null)
                return null;
            return _supportedLanguages[language.Value];
        }

    }
}