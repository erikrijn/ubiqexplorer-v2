using System;
using System.Collections.Generic;
using System.Text;

namespace Caladan.NodeServices
{
    public static class Constants
    {
        public static readonly string Erc20Abi = "[{\"constant\":true,\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"name\":\"\",\"type\":\"uint8\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"_owner\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"name\":\"balance\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"type\":\"function\"}]";
        public static readonly List<KeyValuePair<string, string>> Erc20OpCodes = new List<KeyValuePair<string, string>>()
        {
            new KeyValuePair<string, string>("0x095ea7b3","approve"),
            new KeyValuePair<string, string>("0xa9059cbb","transfer"),
            new KeyValuePair<string, string>("0x23b872dd","transferFrom"),
            new KeyValuePair<string, string>("0x6ea056a9","sweep"),
            new KeyValuePair<string, string>("0x40c10f19","mint"),
        };
    }
}
