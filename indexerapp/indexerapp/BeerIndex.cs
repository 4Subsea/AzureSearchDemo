using DataSource.Beers;
using IndexerApp.Dsl;

namespace IndexerApp
{
    /// <summary>
    /// Define the name and version of the index used to store Documents data.
    /// </summary>
    public static class BeerIndex
    {
        private const string DefaultScoringProfileName = "default";

        private static IndexName Name => new IndexName(1, "Beers", DefaultScoringProfileName);

        public static IndexSchema Schema => 
            new IndexSchemaBuilder<Beer>(Name)
                .Key(d => d.id)
                .Text(d => d.name, language: TextLanguage.English)
                .Text(d => d.description, language: TextLanguage.English)
                .Decimal(d => d.abv)
                .Boolean(d => d.isorganic)
                .DateTime(d => d.created)
                .DateTime(d => d.updated)
                .Text(d => d.stylename, filterable: true, language: TextLanguage.English)
                .Text(d => d.styledescription, language: TextLanguage.English)
                .List(d => d.breweries, filterable: true)
                .StoredOnly(d => d.labelicon)
                .StoredOnly(d => d.labelmediumimage)
                .StoredOnly(d => d.labellargeimage)
                .ScoringProfile(DefaultScoringProfileName, sp => sp
                    .WeightedText(d => d.name, 1.8)
                    .WeightedText(d => d.description, 1.6)
                    .WeightedText(d => d.stylename, 1.4)
                    .WeightedText(d => d.styledescription, 1.2)
                )
                .BuildSchema();
    }
}