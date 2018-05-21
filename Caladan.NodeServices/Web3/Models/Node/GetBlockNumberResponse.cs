using System;
using System.Collections.Generic;
using System.Text;

namespace Caladan.NodeServices.Web3.Models.Node
{
    public class GetBlockNumberResponse
    {
        public string jsonrpc { get; set; }
        public int id { get; set; }
        public string result { get; set; }
    }
}
