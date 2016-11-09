using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;

namespace IndexerApp.Dsl
{
    public class FilterOf<TDocument> : List<FieldFilter>
        where TDocument : class 
    {
        private static class Operand
        {
            public const string And = "and";
            public const string Or = "or";
        }

        public static class Comparison
        {
            public const string Equal = "eq";
            public const string NotEqual = "ne";
            public const string LessThan = "lt";
            public const string LessThanOrEqual = "le";
            public const string GreaterThan = "gt";
            public const string GreaterThanOrEqual = "ge";
        }

        public FilterOf<TDocument> CollectionNotEmpty(Expression<Func<TDocument, string[]>> property)
        {
            var propertyName = Property.NameOf(property);
            Add(new FieldFilter { Name = $"{propertyName}/any()"});
            return this;
        }

        public FilterOf<TDocument> CollectionContains(Expression<Func<TDocument, string[]>> property, string text)
        {
            var propertyName = Property.NameOf(property);
            Add(new FieldFilter { Name = $"{propertyName}/any(e: e {Comparison.Equal} '{text}')"});
            return this;
        }

        public FilterOf<TDocument> CollectionContains(Expression<Func<TDocument, string[]>> property, params string[] values)
        {
            if (values.Length == 1)
            {
                CollectionContains(property, values.First());
                return this;
            }

            return OrGroup(f =>
            {
                foreach (var value in values)
                {
                    f.CollectionContains(property, value);
                }
            });
        }

        public FilterOf<TDocument> CollectionNotContains(Expression<Func<TDocument, string[]>> property, string text)
        {
            var propertyName = Property.NameOf(property);
            Add(new FieldFilter { Name = $"{propertyName}/all(e: e {Comparison.NotEqual} '{text}')"});
            return this;
        }

        public FilterOf<TDocument> FieldEqual(Expression<Func<TDocument, string>> property, string text)
        {
            Add(FieldFilter(property, Comparison.Equal, $"'{text}'"));
            return this;
        }

        public FilterOf<TDocument> FieldEqual(Expression<Func<TDocument, DateTimeOffset?>> property, DateTimeOffset dateTime)
        {
            return DateTimeFilter(property, dateTime, Comparison.Equal);
        }

        public FilterOf<TDocument> FieldNotEqual(Expression<Func<TDocument, DateTimeOffset?>> property, DateTimeOffset dateTime)
        {
            return DateTimeFilter(property, dateTime, Comparison.NotEqual);
        }

        public FilterOf<TDocument> FieldGreaterThan(Expression<Func<TDocument, DateTimeOffset?>> property, DateTimeOffset dateTime)
        {
            return DateTimeFilter(property, dateTime, Comparison.GreaterThan);
        }

        public FilterOf<TDocument> FieldGreaterThanOrEqual(Expression<Func<TDocument, DateTimeOffset?>> property, DateTimeOffset dateTime)
        {
            return DateTimeFilter(property, dateTime, Comparison.GreaterThanOrEqual);
        }

        public FilterOf<TDocument> FieldLessThan(Expression<Func<TDocument, DateTimeOffset?>> property, DateTimeOffset dateTime)
        {
            return DateTimeFilter(property, dateTime, Comparison.LessThan);
        }

        public FilterOf<TDocument> FieldLessThanOrEqual(Expression<Func<TDocument, DateTimeOffset?>> property, DateTimeOffset dateTime)
        {
            return DateTimeFilter(property, dateTime, Comparison.LessThanOrEqual);
        }

        public FilterOf<TDocument> FieldEqual(Expression<Func<TDocument, int?>> property, int value)
        {
            Add(FieldFilter(property, Comparison.Equal, value.ToString(CultureInfo.InvariantCulture)));
            return this;
        }

        /// <summary>
        /// Filter that does a "property in (list of values)" match.
        /// </summary>
        public FilterOf<TDocument> FieldIn(Expression<Func<TDocument, string>> property, IEnumerable<string> values)
        {
            return OrGroup(f =>
            {
                foreach (var value in values)
                {
                    f.FieldEqual(property, value);
                }
            });
        }

        /// <summary>
        /// Filter that does a "property in (list of values)" match.
        /// </summary>
        public FilterOf<TDocument> FieldIn(Expression<Func<TDocument, int?>> property, IEnumerable<int> values)
        {
            return OrGroup(f =>
            {
                foreach (var value in values)
                {
                    f.FieldEqual(property, value);
                }
            });
        }

        public string AsFilterString()
        {
            return AsFilterString(this, Operand.And);
        }

        private static string AsFilterString(IEnumerable<FieldFilter> filterOf, string operand)
        {
            var template = "{2} {3} {4}";
            var andTemplate = "{0} {1} {2} {3} {4}";
            var aggregate = filterOf.Aggregate((string)null,
                (s, filter) => string.Format((s == null ? template : andTemplate),
                s, operand, filter.Name, filter.Comparison, filter.Value).Trim());
            return aggregate != null ? aggregate.Trim() : null;
        }

        private FilterOf<TDocument> DateTimeFilter(Expression<Func<TDocument, DateTimeOffset?>> property, DateTimeOffset dateTime, string comparison)
        {
            if (dateTime.Offset != TimeSpan.Zero)
                throw new ArgumentException("Non-UTC dateTime is not supported", nameof(dateTime));

            Add(FieldFilter(property, comparison, $@"{dateTime:yyyy-MM-ddTHH\:mm\:ss.fffZ}"));
            return this;
        }

        private static FieldFilter FieldFilter<TProperty>(Expression<Func<TDocument, TProperty>> property, string comparison, string value)
        {
            return new FieldFilter
            {
                Name = Property.NameOf(property),
                Comparison = comparison,
                Value = value
            };
        }

        public FilterOf<TDocument> OrGroup(Action<FilterOf<TDocument>> groupFilter)
        {
            var f = new FilterOf<TDocument>();
            groupFilter(f);
            var group = AsFilterString(f, Operand.Or);
            Add(new FieldFilter { Name = $"({group})", Comparison = null, Value = null });
            return this;
        }

    }
}