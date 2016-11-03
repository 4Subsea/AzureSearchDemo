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
                .DateTime(d => d.created)
                .Text(d => d.style, filterable: true)
                .List(d => d.breweries, filterable: true)
                .ScoringProfile(DefaultScoringProfileName, sp => sp
                    .WeightedText(d => d.name, 1.5)
                    .WeightedText(d => d.style, 1.2)
                )
                .BuildSchema();
    }
}