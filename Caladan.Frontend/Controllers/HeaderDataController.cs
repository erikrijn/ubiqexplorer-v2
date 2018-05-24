using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Caladan.Frontend.ViewModels;
using Caladan.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Caladan.Frontend.Controllers
{
    [Route("internalapi/[controller]")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class HeaderDataController : Controller
    {
        private MongoRepository<Caladan.Models.Block> _blockRepository;
        private MongoRepository<Caladan.Models.Price> _priceRepository;

        private IConfiguration _configuration;
        public HeaderDataController(IConfiguration configuration,
            MongoRepository<Caladan.Models.Block> blockRepository,
            MongoRepository<Caladan.Models.Price> priceRepository)
        {
            _configuration = configuration;

            _blockRepository = blockRepository;
            _priceRepository = priceRepository;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Get()
        {
            long currentTimestamp = ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeSeconds();
            long minOneHourTimestamp = ((DateTimeOffset)DateTime.UtcNow.AddHours(-24)).ToUnixTimeSeconds();

            var headerData = new HeaderData();

            var orderByBlock = Builders<Caladan.Models.Block>.Sort.Descending("block_number");
            var getLastBlock = _blockRepository.GetAsync(null, orderByBlock);

            var builder = Builders<Caladan.Models.Block>.Filter;
            var filter = builder.Where(x => x.Timestamp > (ulong)minOneHourTimestamp);
            var orderByBlockAsc = Builders<Caladan.Models.Block>.Sort.Ascending("timestamp");
            var getOldBlock = _blockRepository.GetAsync(filter, orderByBlockAsc);

            var priceBuilder = Builders<Caladan.Models.Price>.Filter;
            var priceFilter = priceBuilder.Where(x => x.Symbol == _configuration["AppSettings:MainCurrencySymbol"]);
            var orderByPrice = Builders<Caladan.Models.Price>.Sort.Descending("last_updated");
            var getLastPrice = _priceRepository.GetAsync(priceFilter, orderByPrice);

            await Task.WhenAll(getLastBlock, getLastPrice, getOldBlock);

            long averageBlockTime = 0;
            if (getOldBlock.Result != null)
                averageBlockTime = (currentTimestamp - (long)getOldBlock.Result.Timestamp) / ((long)getLastBlock.Result.BlockNumber - (long)getOldBlock.Result.BlockNumber);

            return Ok(new HeaderData()
            {
                Found = true,
                LatestBlockNumber = getLastBlock.Result != null ? getLastBlock.Result.BlockNumber : 0,
                MarketCap = getLastPrice.Result != null ? getLastPrice.Result.MarketCapUsd : 0,
                Price = getLastPrice.Result != null ? getLastPrice.Result.PriceUsd : 0,
                AverageBlockTime = averageBlockTime
            });
        }
    }
}