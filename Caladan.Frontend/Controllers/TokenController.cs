using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Caladan.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Caladan.Frontend.Controllers
{
    [Route("internalapi/[controller]")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class TokenController : Controller
    {
        private MongoRepository<Caladan.Models.Price> _priceRepository;
        private MongoRepository<Caladan.Models.Token> _tokenRepository;

        private IConfiguration _configuration;
        public TokenController(IConfiguration configuration,
            MongoRepository<Caladan.Models.Price> priceRepository,
            MongoRepository<Caladan.Models.Token> tokenRepository)
        {
            _configuration = configuration;

            _priceRepository = priceRepository;
            _tokenRepository = tokenRepository;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAll()
        {
            var tokens = await _tokenRepository.GetAllAsync();
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
                var lastPrice = await _priceRepository.GetAsync(x => x.Symbol == token.Symbol, x => x.LastUpdatedTimestamp, true);
                if (lastPrice != null)
                    token.Price = lastPrice.PriceUsd;
            }

            return Ok(result);
        }
    }
}