using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Swashbuckle.AspNetCore.SwaggerGen;
using Caladan.NodeServices.Web3;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace Caladan.Frontend.Controllers.Api
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private IConfiguration _configuration;
        private List<string> _nodeUrls;
        public AccountController(IConfiguration configuration)
        {
            _configuration = configuration;
            var nodesCfgValue = configuration["AppSettings:Nodes"];
            if (string.IsNullOrEmpty(nodesCfgValue))
                throw new Exception("Configuration value for 'Nodes' cannot be empty.");

            _nodeUrls = nodesCfgValue.Contains(',') ? nodesCfgValue.Split(',').ToList() : new List<string>() { nodesCfgValue };
        }

        /// <summary>
        /// Gets an account by the specified address.
        /// </summary>
        /// <param name="address">The address.</param>
        /// <param name="includeTop1000Transactions">if set to <c>true</c> [include top1000 transactions].</param>
        /// <returns></returns>
        [HttpGet("{address}")]
        [ProducesResponseType(typeof(Models.Api.Account), 200)]
        [SwaggerResponse(200, Type = typeof(Models.Api.Account))]
        public async Task<IActionResult> Get(string address, bool includeTop1000Transactions = false)
        {
            using (var accountService = new AccountService(_nodeUrls))
            {
                var account = await accountService.GetAccountAsync(address.ToLower(), includeTop1000Transactions, 1000);
                if (account == null)
                    return NotFound($"Account {address} could not be found.");

                var apiAccount = new Models.Api.Account()
                {
                    Address = account.Address,
                    Balance = account.Balance,
                    FirstRequestedOn = account.FirstRequestedOn,
                    LastUpdatedOn = account.LastUpdatedOn,
                    Name = account.Name,
                    Transactions = account.Transactions.ToList()
                         .Select(x => new Models.Api.Transaction()
                         {
                             BlockHash = x.BlockHash,
                             BlockNumber = x.BlockNumber,
                             From = x.From,
                             Gas = x.Gas,
                             GasPrice = x.GasPrice,
                             Input = x.Input,
                             Nonce = x.Nonce,
                             Timestamp = x.Timestamp,
                             To = x.To,
                             TransactionHash = x.TransactionHash,
                             TransactionIndex = x.TransactionIndex,
                             Value = x.Value.FromHexWei(x.Decimals)
                         }).ToArray(),
                    NumberOfTransactions = account.NumberOfTransactions
                };
                
                return Ok(apiAccount);
            }
        }
    }
}