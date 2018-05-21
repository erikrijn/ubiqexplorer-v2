using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Caladan.Frontend.Models.Api
{
    public class Account
    {
        public string Address { get; set; }

        public string Name { get; set; }

        public double Balance { get; set; }

        public DateTime FirstRequestedOn { get; set; }

        public DateTime LastUpdatedOn { get; set; }

        public Transaction[] Transactions { get; set; }

        public ulong LastSeenInBlock
        {
            get
            {
                if (Transactions == null)
                    return 0;
                return Transactions.Length > 0 ? Transactions.ToList().OrderByDescending(x => x.BlockNumber).First().BlockNumber : 0;
            }
        }

        public int NumberOfTransactions { get; set; }
    }
}
