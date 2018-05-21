using System;
using System.Collections.Generic;
using System.Text;

namespace Caladan.NodeServices.Web3.Models.Node
{
    public class GetTransactionResponse : BaseResponse
    {
        public Transaction result { get; set; }
    }

}
