using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Caladan.Frontend.Controllers
{
    [Route("internalapi/[controller]")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class SearchController : Controller
    {
        [HttpGet("[action]")]
        public IActionResult Get(string searchTerm)
        {
            if (searchTerm == null)
                return Ok("invalid");

            if (searchTerm.StartsWith("0x") && searchTerm.Length == 42)
                return Ok("account");

            if (searchTerm.StartsWith("0x") && searchTerm.Length == 66)
                return Ok("transaction");

            if (searchTerm.Length < 12)
            {
                if (int.TryParse(searchTerm, out int blockNumber))
                    return Ok("block");
            }

            return Ok("invalid");
        }
    }
}