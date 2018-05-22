using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Caladan.Models;
using Caladan.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Caladan.Frontend.Controllers.Api
{
    [Route("api/[controller]")]
    public class PriceController : Controller
    {
        private IConfiguration _configuration;
        public PriceController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Gets the latest price.
        /// </summary>
        /// <returns></returns>
        [HttpGet("")]
        [ProducesResponseType(typeof(Models.Api.Price), 200)]
        [SwaggerResponse(200, Type = typeof(Models.Api.Price))]
        public async Task<IActionResult> Get()
        {
            using (var priceService = new MongoRepository<Price>())
            {
                var lastPrice = await priceService.GetAsync(x => x.Symbol == _configuration["AppSettings:MainCurrencySymbol"], x => x.LastUpdatedTimestamp, true);
                return Ok(new Models.Api.Price()
                {
                    AvailableSupply = lastPrice.AvailableSupply,
                    LastUpdatedTimestamp = lastPrice.LastUpdatedTimestamp,
                    MarketCapEur = lastPrice.MarketCapEur,
                    MarketCapUsd = lastPrice.MarketCapUsd,
                    Name = lastPrice.Name,
                    PercentChange1h = lastPrice.PercentChange1h,
                    PercentChange24h = lastPrice.PercentChange24h,
                    PercentChange7d = lastPrice.PercentChange7d,
                    PriceBtc = lastPrice.PriceBtc,
                    PriceEur = lastPrice.PriceEur,
                    PriceUsd = lastPrice.PriceUsd,
                    Rank = lastPrice.Rank,
                    Symbol = lastPrice.Symbol,
                    TotalSupply = lastPrice.TotalSupply,
                    VolumeEur24h = lastPrice.VolumeEur24h,
                    VolumeUsd24h = lastPrice.VolumeUsd24h
                });
            }
        }
    }
}