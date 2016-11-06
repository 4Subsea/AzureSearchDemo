using System;
using System.Collections.Generic;
using System.Linq;
using DataSource.Beers;
using DataSource.Styles;
using IndexerApp.Dsl;

namespace IndexerApp
{
    class Program
    {

        static void Main(string[] args)
        {
            Config.BeerDbApiKey = args[0];
            Config.SearchApiKey = args[1];

            var beerIndex = BeerIndex.Schema;

            CreateIndexes(true, beerIndex);

            // Get data from brewerydb.com
            // For each beer style, page-load all beers and stuff'em into the index

            var styles = Styles.Load(Config.BeerDbApiKey).Skip(4).Take(2);
            var beers = styles.SelectMany(LoadBeers).ToList();

            IndexBeers(beerIndex, beers);

            Console.WriteLine("Done");
            Console.ReadLine();
        }

        private static void CreateIndexes(bool forceRecreate, params IndexSchema[] indexSchemas)
        {
            var search = new AzureSearch();

            foreach (var index in indexSchemas)
            {
                if (forceRecreate || search.IsIndexOutdated(index.Name))
                {
                    search.DeleteIndex(index.Name);

                    Console.WriteLine($"Creating index '{index.Name.FullName}'");
                    search.CreateIndex(index.Name, index.Fields, index.ScoringProfiles);
                }
            }
        }

        private static IEnumerable<Beer> LoadBeers(Style style)
        {
            var page = 1;
            var totalPages = 1;
            while (page <= totalPages)
            {
                Console.WriteLine($"Loading '{style.Name}' beers, page {page}...");

                var beerPage = Beers.Load(Config.BeerDbApiKey, style, page);
                foreach (var beer in beerPage.Beers)
                {
                    yield return beer;
                }
                totalPages = beerPage.TotalPages;

                Console.WriteLine($"Loaded {style.Name} beers, page {page} of {totalPages}");

                page++;
            }
        }

        private static void IndexBeers(IndexSchema beerIndex, IEnumerable<Beer> beers)
        {
            Console.WriteLine($"Indexing into {beerIndex.Name.Name} ...");

            var search = new AzureSearch();
            search.Index(beerIndex.Name, beers);
        }
    }
}
