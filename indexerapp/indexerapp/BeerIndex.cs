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
                .Text(d => d.name, sortable:true, language: TextLanguage.English)
                .Text(d => d.description, language: TextLanguage.English)
                .Decimal(d => d.abv, sortable: true, facetable: true)
                .Boolean(d => d.isorganic, sortable: true, facetable: true)
                .DateTime(d => d.created, sortable: true, facetable: true)
                .DateTime(d => d.updated, sortable: true, facetable: true)
                .Text(d => d.stylename, sortable: true, filterable: true, facetable: true, language: TextLanguage.English)
                .Text(d => d.styledescription, language: TextLanguage.English)
                .List(d => d.breweries, filterable: true, facetable: true)
                .Location(d => d.brewerylocation, sortable: true, filterable: true)
                .StoredOnly(d => d.labelicon)
                .StoredOnly(d => d.labelmediumimage)
                .StoredOnly(d => d.labellargeimage)
                .ScoringProfile(DefaultScoringProfileName, sp => sp
                    .WeightedText(d => d.name, 1.8)
                    .WeightedText(d => d.description, 1.6)
                    .WeightedText(d => d.stylename, 1.4)
                    .WeightedText(d => d.styledescription, 1.2)
                )
                .Suggester("suggestBeerName", s => s.Field(d => d.name))
                .BuildSchema();
    }
}