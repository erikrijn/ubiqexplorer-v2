using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using Caladan.NodeServices.Web3;
using Caladan.Repositories;

namespace Caladan.Frontend.Controllers.Api
{
    [Route("api/[controller]")]
    public class BalanceController : Controller
    {
        private MongoRepository<Caladan.Models.Transaction> _transactionRepository;
        private MongoRepository<Caladan.Models.Account> _accountRepository;

        private IConfiguration _configuration;
        private List<string> _nodeUrls;
        public BalanceController(IConfiguration configuration,
            MongoRepository<Caladan.Models.Transaction> transactionRepository,
            MongoRepository<Caladan.Models.Account> accountRepository)
        {
            _configuration = configuration;
            var nodesCfgValue = configuration["AppSettings:Nodes"];
            if (string.IsNullOrEmpty(nodesCfgValue))
                throw new Exception("Configuration value for 'Nodes' cannot be empty.");

            _nodeUrls = nodesCfgValue.Contains(',') ? nodesCfgValue.Split(',').ToList() : new List<string>() { nodesCfgValue };
        }

        /// <summary>
        /// Gets the balance of the specified address.
        /// </summary>
        /// <param name="address">The address.</param>
        /// <returns></returns>
        [HttpGet("{address}")]
        [ProducesResponseType(typeof(decimal), 200)]
        [SwaggerResponse(200, Type = typeof(decimal))]
        public async Task<IActionResult> Get(string address)
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress.ToString();

            using (var accountService = new AccountService(_nodeUrls, _transactionRepository, _accountRepository))
            {
                try
                {
                    var balance = await accountService.GetBalanceFromNodeAsync(address);
                    //var account = await accountService.GetAccountAsync(address, ipAddress, false);
                    return Ok(balance);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, ex.Message);
                }
            }
        }
    }
}