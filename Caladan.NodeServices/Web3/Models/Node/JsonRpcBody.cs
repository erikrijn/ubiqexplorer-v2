using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Caladan.NodeServices.Web3.Models.Node
{
    public class JsonRpcBody
    {
        private List<object> _params;

        public JsonRpcBody(string method, int id)
        {
            Method = method;
            Id = id;
            _params = new List<object>();
        }

        public void AddParam(object param) => _params.Add(param);


        [JsonProperty(PropertyName = "jsonrpc")]
        public string JsonRpc { get { return "2.0"; } }

        [JsonProperty(PropertyName = "method")]
        public string Method { get; set; }

        [JsonProperty(PropertyName = "params")]
        public object[] Params
        {
            get
            {
                return _params.ToArray();
            }
        }

        [JsonProperty(PropertyName = "id")]
        public int Id { get; set; }
    }

}
