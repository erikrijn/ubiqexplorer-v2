using System;
using System.Collections.Generic;
using System.Text;

namespace Caladan.NodeServices.Web3.Models.Node
{
    public class GetBlockResponse : BaseResponse
    {
        public Block result { get; set; }
    }
}
