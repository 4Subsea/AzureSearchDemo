using System;
using System.Collections.Generic;
using System.Linq;
using datasource;

namespace indexerapp
{
    class Program
    {
        private static readonly string ApiKey = "5120b367e367474b023f7829a2b536b6";

        private static string StyleUriFor()
        {
            return $"http://api.brewerydb.com/v2/styles?key={ApiKey}";
        }

        private static string BeerUriFor(int page = 1, int styleId = 1)
        {
            var apiKey = "5120b367e367474b023f7829a2b536b6";
            return $"http://api.brewerydb.com/v2/beers?key={apiKey}&p={page}&styleId={styleId}&withBreweries=Y";
        }

        static void Main(string[] args)
        {
            var styles = Styles.Load(StyleUriFor());
            foreach (var style in styles)
            {
                Console.WriteLine($"Style: {style.Name}:\n\n");
                var beers = LoadBeers(style.Id);
                foreach (var name in beers.Take(5))
                {
                    Console.WriteLine($"Beer: {name.Name} - Breweries: {name.Breweries} - {name.Page}");
                }
            }

            Console.ReadLine();
        }

        private static IEnumerable<Beer> LoadBeers(int styleId)
        {
            var page = 1;
            var totalPages = 1;
            while (page <= totalPages)
            {
                var beerPage = Beers.Load(BeerUriFor(page, styleId));
                foreach (var beer in beerPage.Beers)
                {
                    yield return beer;
                }
                totalPages = beerPage.TotalPages;
                page++;
            }
        }
    }
}
