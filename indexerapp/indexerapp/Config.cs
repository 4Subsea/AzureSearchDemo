using System.Configuration;

namespace IndexerApp
{
    static class Config
    {
        public static string SearchServiceName => ConfigurationManager.AppSettings.Get("azureSearch:serviceName");
        public static string SearchApiKey { get; set; }
        public static string BeerDbApiKey { get; set; }
    }
}
