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

            ReCreateIndexes(beerIndex);

            // Get data from brewerydb.com
            // For each beer style, page-load all beers and stuff'em into the index

            var beers = from style in Styles.Load(Config.BeerDbApiKey)
                        from beer in LoadBeers(style)
                        select beer;

            var search = new AzureSearch();
            search.Index(beerIndex.Name, beers.Take(5));

            Console.WriteLine("Done");
            Console.ReadLine();
        }

        private static void ReCreateIndexes(params IndexSchema[] indexSchemas)
        {
            var search = new AzureSearch();
            
            foreach (var index in indexSchemas)
            {
                if (search.IndexExist(index.Name))
                    search.DeleteIndex(index.Name);

                Console.WriteLine($"Creating index '{index.Name.FullName}'");
                search.CreateIndex(index.Name, index.Fields, index.ScoringProfiles);
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
    }
}
