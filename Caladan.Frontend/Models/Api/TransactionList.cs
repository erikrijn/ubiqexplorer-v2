using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Caladan.Frontend.Models.Api
{
    public class TransactionList
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int NumberOfPages
        {
            get
            {
                return (TotalCount + PageSize - 1) / PageSize;
            }
        }
        public Models.Api.Transaction[] Transactions { get; set; }
    }
}
