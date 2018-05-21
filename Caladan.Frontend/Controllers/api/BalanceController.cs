using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using Caladan.NodeServices.Web3;

namespace Caladan.Frontend.Controllers.Api
{
    [Route("api/[controller]")]
    public class BalanceController : Controller
    {
        private IConfiguration _configuration;
        private List<string> _nodeUrls;
        public BalanceController(IConfiguration configuration)
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

            using (var accountService = new AccountService(_nodeUrls))
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