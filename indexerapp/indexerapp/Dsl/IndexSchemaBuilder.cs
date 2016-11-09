using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.Azure.Search.Models;

namespace IndexerApp.Dsl
{
    public enum TextLanguage
    {
        English,
        Norwegian
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
    }

    public class IndexSchemaBuilder<TDocument>
        where TDocument : class
    {
        private class WeightedTextProfileBuilder : IScoringProfile<TDocument>
        {
            private readonly List<Tuple<string, double>> _textWeights = new List<Tuple<string, double>>();

            public IScoringProfile<TDocument> WeightedText<TProperty>(Expression<Func<TDocument, TProperty>> property, double weight)
            {
                _textWeights.Add(new Tuple<string, double>(NameOf(property), weight));
                return this;
            }

            public IDictionary<string, double> Build()
            {
                return _textWeights.ToDictionary(tp => tp.Item1, tp => tp.Item2);
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

        public IndexSchemaBuilder(IndexName indexName)
        {
            _indexName = indexName;
            _fields = new List<Field>();
            _scoringProfiles = new List<ScoringProfile>();
        }

        public IndexSchema BuildSchema()
        {
            return new IndexSchema
            {
                Name = _indexName,
                Fields = _fields,
                ScoringProfiles = _scoringProfiles
            };
        }

        /// <summary>
        /// Create a "text weight" scoring profile for this index.
        /// </summary>
        public IndexSchemaBuilder<TDocument> ScoringProfile(string name, Action<IScoringProfile<TDocument>> configureScoringProfile)
        {
            var profileBuilder = new WeightedTextProfileBuilder();
            configureScoringProfile(profileBuilder);

            _scoringProfiles.Add(new ScoringProfile(name) { TextWeights = new TextWeights(profileBuilder.Build()) });
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

        public IndexSchemaBuilder<TDocument> Text<TProperty>(Expression<Func<TDocument, TProperty>> propertyName, bool searchable = true, bool filterable = false, TextLanguage? language = null)
        {
            Add(Field(propertyName, DataType.String, searchable, filterable, language));
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

        public IndexSchemaBuilder<TDocument> Integer<TProperty>(Expression<Func<TDocument, TProperty>> propertyName, bool filterable = true)
        {
            Add(Field(propertyName, DataType.Int32, false, filterable));
            return this;
        }

        public IndexSchemaBuilder<TDocument> DateTime<TProperty>(Expression<Func<TDocument, TProperty>> propertyName, bool filterable = true)
        {
            Add(Field(propertyName, DataType.DateTimeOffset, false, filterable));
            return this;
        }

        public IndexSchemaBuilder<TDocument> List<TProperty>(Expression<Func<TDocument, TProperty>> propertyName, bool searchable = true, bool filterable = false)
        {
            Add(Field(propertyName, DataType.Collection(DataType.String), searchable, filterable));
            return this;
        }

        private Field Field<TProperty>(Expression<Func<TDocument, TProperty>> propertyName, DataType dataType = null, bool searchable = true, bool filterable = false, TextLanguage? language = null)
        {
            return new Field(NameOf(propertyName), dataType ?? DataType.String)
            {
                IsSearchable = searchable,
                IsFilterable = filterable,
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