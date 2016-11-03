using System;
using System.Linq.Expressions;
using System.Reflection;

namespace IndexerApp.Dsl
{
    public static class Property
    {
        public static string NameOf<TEntity, TProperty>(Expression<Func<TEntity, TProperty>> expr)
        {
            return GetPropertyFromExpression(expr).Name;
        }

        private static PropertyInfo GetPropertyFromExpression<TParent, TProperty>(Expression<Func<TParent, TProperty>> property)
        {
            var propertyInfo = ((MemberExpression)property.Body).Member as PropertyInfo;
            if (propertyInfo == null)
                throw new InvalidOperationException("Expression must be a property");
            return propertyInfo;
        }
    }
}
