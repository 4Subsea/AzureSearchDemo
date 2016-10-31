using System;
using System.Collections.Generic;
using System.Linq;
using datasource;

namespace indexerapp
{
    class Program
    {
        private static string _apiKey;

        private static string StyleUriFor()
        {
            return $"http://api.brewerydb.com/v2/styles?key={_apiKey}";
        }

        private static string BeerUriFor(int page = 1, int styleId = 1)
        {
            return $"http://api.brewerydb.com/v2/beers?key={_apiKey}&p={page}&styleId={styleId}&withBreweries=Y";
        }

        static void Main(string[] args)
        {
            _apiKey = args[0];

            var styles = Styles.Load(StyleUriFor());
            foreach (var style in styles.Take(3))
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
