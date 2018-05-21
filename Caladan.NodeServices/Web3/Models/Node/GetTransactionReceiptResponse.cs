using System;
using System.Collections.Generic;
using System.Text;

namespace Caladan.NodeServices.Web3.Models.Node
{
    class GetTransactionReceiptResponse : BaseResponse
    {
        public TransactionReceipt result { get; set; }
    }
}
