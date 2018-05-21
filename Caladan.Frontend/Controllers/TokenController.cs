using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Caladan.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Caladan.Frontend.Controllers
{
    [Route("internalapi/[controller]")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class TokenController : Controller
    {
        [HttpGet("[action]")]
        public async Task<IActionResult> GetAll()
        {
            using (var tokenRepository = new MongoRepository<Caladan.Models.Token>())
            using (var mongoCurrencyPriceService = new MongoRepository<Caladan.Models.Price>())
            {
                var tokens = await tokenRepository.GetAllAsync();

                var result = tokens.OrderBy(x => x.Name).Select(x => new ViewModels.Token()
                {
                    Address = x.Address,
                    Decimals = x.Decimals,
                    Description = x.Description,
                    Logo = x.Logo,
                    Name = x.Name,
                    Standard = x.Standard,
                    Symbol = x.Symbol,
                    Website = x.Website

                }).ToArray();

                foreach (var token in result)
                {
                    var lastPrice = await mongoCurrencyPriceService.GetAsync(x => x.Symbol == token.Symbol, x => x.LastUpdatedTimestamp, true);
                    if (lastPrice != null)
                        token.Price = lastPrice.PriceUsd;
                }

                return Ok(result);
            }
        }
    }
}