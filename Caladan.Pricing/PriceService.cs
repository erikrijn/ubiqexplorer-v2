using Caladan.Models;
using Caladan.Repositories;
using System.Threading.Tasks;

namespace Caladan.Pricing
{
    /// <summary>
    /// PriceService class.
    /// </summary>
    public static class PriceService
    {
        /// <summary>
        /// Gets the price last asynchronous.
        /// </summary>
        /// <returns></returns>
        public static async Task GetPriceLastAsync(string ticker, string symbol)
        {
            var apiResource = $"https://api.coinmarketcap.com/v1/ticker/{ticker}/?convert=EUR";
            using (var restService = new RestService<string, Price[]>(apiResource))
            {
                var mongoCurrencyPriceService = new MongoRepository<Price>();
                var response = await restService.GetAsync();
                if (response != null && response.Length > 0)
                {
                    var lastPrice = await mongoCurrencyPriceService.GetAsync(x => x.Symbol == symbol, x => x.LastUpdatedTimestamp, true);
                    var price = response[0];
                    if (lastPrice == null || price.PriceBtc != lastPrice.PriceBtc)
                        await mongoCurrencyPriceService.SaveAsync(price);
                }
            }
        }
    }
}
