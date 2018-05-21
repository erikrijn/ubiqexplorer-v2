using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Caladan.Frontend.Models.Api
{
    public class Transaction
    {
        public string TransactionHash { get; set; }

        public ulong BlockNumber { get; set; }

        public ulong TransactionIndex { get; set; }

        public string BlockHash { get; set; }

        public string From { get; set; }

        public string To { get; set; }

        public ulong Gas { get; set; }

        public ulong GasPrice { get; set; }

        public double Value { get; set; }
        public string Symbol { get; set; }

        public string Input { get; set; }

        public ulong Nonce { get; set; }

        public ulong Timestamp { get; set; }

        public DateTime Created
        {
            get
            {
                var created = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
                created = created.AddSeconds(Timestamp).ToLocalTime();
                return created;

            }
        }
    }
}
