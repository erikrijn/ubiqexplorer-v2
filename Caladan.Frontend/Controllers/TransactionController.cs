using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Caladan.Frontend.Helpers;
using Caladan.NodeServices.Web3;
using Caladan.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Caladan.Frontend.Controllers
{
    [Route("internalapi/[controller]")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class TransactionController : Controller
    {
        private IConfiguration _configuration;
        private List<string> _nodeUrls;
        public TransactionController(IConfiguration configuration)
        {
            _configuration = configuration;
            var nodesCfgValue = configuration["AppSettings:Nodes"];
            if (string.IsNullOrEmpty(nodesCfgValue))
                throw new Exception("Configuration value for 'Nodes' cannot be empty.");

            _nodeUrls = nodesCfgValue.Contains(',') ? nodesCfgValue.Split(',').ToList() : new List<string>() { nodesCfgValue };
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Get(string transactionHash)
        {
            using (var transactionService = new TransactionService(_nodeUrls))
            using (var blockService = new BlockService(_nodeUrls))
            using (var transactionRepository = new MongoRepository<Caladan.Models.Transaction>())
            using (var transactionReceiptRepository = new MongoRepository<Caladan.Models.TransactionReceipt>())
            using (var blockRepository = new MongoRepository<Caladan.Models.Block>())
            {
                var transactionBuilder = Builders<Caladan.Models.Transaction>.Filter;
                var transactionFilter = transactionBuilder.Where(x => x.TransactionHash == transactionHash.ToLower());
                var transactions = await transactionRepository.FindAsync(transactionFilter, null);
                var transaction = transactions.FirstOrDefault();

                if (transaction == null)
                {
                    transaction = await transactionService.GetTransactionAsync(transactionHash);
                    if (transaction == null)
                        return Ok(new ViewModels.Transaction() { Found = false });
                }

                await GetTransactionReceipt(transactionHash, transactionService, transactionRepository, transactionReceiptRepository, transaction);

                ulong confirmations = 0;
                if (transaction.BlockNumber != 0)
                {
                    var orderByBlock = Builders<Caladan.Models.Block>.Sort.Descending("block_number");
                    var lastBlock = await blockRepository.GetAsync(null, orderByBlock);

                    if (lastBlock == null || lastBlock.BlockNumber < transaction.BlockNumber)
                        confirmations = await blockService.GetBlockNumberFromNodeAsync() - transaction.BlockNumber + 1;
                    else
                        confirmations = lastBlock.BlockNumber - transaction.BlockNumber + 1;
                }

                double fee = 0;
                if (transaction.Receipt != null)
                    fee = NodeServices.Helpers.ConversionHelper.ConvertWei(transaction.Receipt.GasUsed * transaction.GasPrice, 18);

                var result = new ViewModels.Transaction()
                {
                    BlockNumber = transaction.BlockNumber,
                    From = transaction.From,
                    Gas = transaction.Gas,
                    GasPrice = (ulong)NodeServices.Helpers.ConversionHelper.ConvertWei(transaction.GasPrice, 9),
                    GasUsed = transaction.Receipt?.GasUsed ?? 0,
                    Fee = fee,
                    To = transaction.To,
                    TransactionHash = transaction.TransactionHash,
                    Value = transaction.Value.FromHexWei(transaction.Decimals),
                    Symbol = transaction.Symbol,
                    BlockHash = transaction.BlockHash,
                    ConfirmedOnFormatted = transaction.Created.ToString(),
                    Input = transaction.Input,
                    Nonce = transaction.Nonce,
                    Timestamp = transaction.Timestamp,
                    TransactionIndex = transaction.TransactionIndex,
                    PriceBtc = transaction.PriceBtc,
                    PriceEur = transaction.PriceEur,
                    PriceUsd = transaction.PriceUsd,
                    Confirmations = confirmations,
                    Receipt = transaction.Receipt == null ? null : new ViewModels.TransactionReceipt()
                    {
                        BlockHash = transaction.Receipt.BlockHash,
                        BlockNumber = transaction.Receipt.BlockNumber,
                        ContractAddress = transaction.Receipt.ContractAddress,
                        CumulativeGasUsed = transaction.Receipt.CumulativeGasUsed,
                        GasUsed = transaction.Receipt.GasUsed,
                        Logs = transaction.Receipt.Logs,
                        TransactionHash = transaction.Receipt.TransactionHash,
                        TransactionIndex = transaction.Receipt.TransactionIndex,
                        From = transaction.Receipt.From,
                        LogsBloom = transaction.Receipt.LogsBloom,
                        Root = transaction.Receipt.Root,
                        To = transaction.Receipt.To
                    },
                    Found = true
                };

                result.Raw = SerializeTransaction(result);
                if (transaction.Receipt != null)
                    result.ReceiptRaw = SerializeTransactionReceipt(transaction.Receipt);

                return Ok(result);
            }
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetLatestTransactions(int limit = 50)
        {
            using (var transactionRepository = new MongoRepository<Caladan.Models.Transaction>())
            {
                var builder = Builders<Caladan.Models.Transaction>.Filter;
                var filter = builder.Where(x => x.ShowOnAccountPage);
                var orderBy = Builders<Caladan.Models.Transaction>.Sort.Descending("block_number");
                var dbTransactions = await transactionRepository.FindAsync(filter, orderBy, limit);

                return Ok(dbTransactions.Select(x => new ViewModels.SimpleTransaction
                {
                    BlockNumber = x.BlockNumber,
                    From = x.From,
                    Gas = x.Gas,
                    GasPrice = x.GasPrice,
                    To = x.To,
                    TransactionHash = x.TransactionHash,
                    OriginalTransactionHash = x.OriginalTransactionHash,
                    Value = x.Value.FromHexWei(x.Decimals),
                    ConfirmedOnFormatted = x.Created.ToString(),
                    Found = true,
                    Symbol = x.Symbol == null ? _configuration["AppSettings:MainCurrencySymbol"] : x.Symbol
                }));
            }
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetPendingTransactions()
        {
            using (var transactionService = new TransactionService(_nodeUrls))
            {
                var transactions = await transactionService.GetPendingTransactionsAsync();
                return Ok(transactions.Select(x => new ViewModels.SimpleTransaction
                {
                    BlockNumber = x.BlockNumber,
                    From = x.From,
                    Gas = x.Gas,
                    GasPrice = x.GasPrice,
                    To = x.To,
                    TransactionHash = x.TransactionHash,
                    OriginalTransactionHash = x.OriginalTransactionHash,
                    Value = x.Value.FromHexWei(x.Decimals),
                    ConfirmedOnFormatted = x.Created.ToString(),
                    Found = true,
                    Symbol = x.Symbol == null ? _configuration["AppSettings:MainCurrencySymbol"] : x.Symbol
                }));
            }
        }

        private static async Task GetTransactionReceipt(string transactionHash, TransactionService transactionService, MongoRepository<Caladan.Models.Transaction> transactionRepository, 
            MongoRepository<Caladan.Models.TransactionReceipt> transactionReceiptRepository, Caladan.Models.Transaction transaction)
        {
            if (transaction.BlockNumber > 0)
            {
                var transactionReceiptBuilder = Builders<Caladan.Models.TransactionReceipt>.Filter;
                var transactionReceiptFilter = transactionReceiptBuilder.Where(x => x.TransactionHash == transactionHash.ToLower());
                var transactionReceipts = await transactionReceiptRepository.FindAsync(transactionReceiptFilter, null);
                var transactionReceipt = transactionReceipts.FirstOrDefault();

                if (transactionReceipt == null)
                    transactionReceipt = await transactionService.GetTransactionReceiptAsync(transactionHash.ToLower());

                transaction.Receipt = transactionReceipt;
            }
        }

        private static string SerializeTransaction(ViewModels.Transaction result)
        {
            var jsonResolver = new PropertyRenameAndIgnoreSerializerContractResolver();
            jsonResolver.IgnoreProperty(typeof(ViewModels.Transaction), "PriceBtc");
            jsonResolver.IgnoreProperty(typeof(ViewModels.Transaction), "PriceEur");
            jsonResolver.IgnoreProperty(typeof(ViewModels.Transaction), "PriceUsd");
            jsonResolver.IgnoreProperty(typeof(ViewModels.Transaction), "ConfirmedOnFormatted");
            jsonResolver.IgnoreProperty(typeof(ViewModels.Transaction), "Raw");
            jsonResolver.IgnoreProperty(typeof(ViewModels.Transaction), "ReceiptRaw");
            jsonResolver.IgnoreProperty(typeof(ViewModels.Transaction), "OriginalTransactionHash");
            jsonResolver.IgnoreProperty(typeof(ViewModels.Transaction), "Symbol");
            jsonResolver.IgnoreProperty(typeof(ViewModels.Transaction), "Url");
            jsonResolver.IgnoreProperty(typeof(ViewModels.Transaction), "Found");
            jsonResolver.IgnoreProperty(typeof(ViewModels.Transaction), "Confirmations");

            var serializerSettings = new JsonSerializerSettings();
            serializerSettings.ContractResolver = jsonResolver;

            var json = JsonConvert.SerializeObject(result, Formatting.Indented, serializerSettings);
            return json;
        }

        private static string SerializeTransactionReceipt(Caladan.Models.TransactionReceipt receipt)
        {
            var jsonResolver = new PropertyRenameAndIgnoreSerializerContractResolver();
            jsonResolver.IgnoreProperty(typeof(Caladan.Models.TransactionReceipt), "Id");

            var serializerSettings = new JsonSerializerSettings();
            serializerSettings.ContractResolver = jsonResolver;

            var json = JsonConvert.SerializeObject(receipt, Formatting.Indented, serializerSettings);
            return json;
        }

        public class PropertyRenameAndIgnoreSerializerContractResolver : DefaultContractResolver
        {
            private readonly Dictionary<Type, HashSet<string>> _ignores;
            private readonly Dictionary<Type, Dictionary<string, string>> _renames;

            public PropertyRenameAndIgnoreSerializerContractResolver()
            {
                _ignores = new Dictionary<Type, HashSet<string>>();
                _renames = new Dictionary<Type, Dictionary<string, string>>();
            }

            public void IgnoreProperty(Type type, params string[] jsonPropertyNames)
            {
                if (!_ignores.ContainsKey(type))
                    _ignores[type] = new HashSet<string>();

                foreach (var prop in jsonPropertyNames)
                    _ignores[type].Add(prop);
            }

            public void RenameProperty(Type type, string propertyName, string newJsonPropertyName)
            {
                if (!_renames.ContainsKey(type))
                    _renames[type] = new Dictionary<string, string>();

                _renames[type][propertyName] = newJsonPropertyName;
            }

            protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
            {
                var property = base.CreateProperty(member, memberSerialization);

                if (IsIgnored(property.DeclaringType, property.PropertyName))
                    property.ShouldSerialize = i => false;

                if (IsRenamed(property.DeclaringType, property.PropertyName, out var newJsonPropertyName))
                    property.PropertyName = newJsonPropertyName;

                return property;
            }

            private bool IsIgnored(Type type, string jsonPropertyName)
            {
                if (!_ignores.ContainsKey(type))
                    return false;

                return _ignores[type].Contains(jsonPropertyName);
            }

            private bool IsRenamed(Type type, string jsonPropertyName, out string newJsonPropertyName)
            {
                Dictionary<string, string> renames;

                if (!_renames.TryGetValue(type, out renames) || !renames.TryGetValue(jsonPropertyName, out newJsonPropertyName))
                {
                    newJsonPropertyName = null;
                    return false;
                }

                return true;
            }
        }
    }
}