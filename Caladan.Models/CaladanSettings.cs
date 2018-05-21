using System;
using System.Collections.Generic;
using System.Text;

namespace Caladan.Models
{
    public class CaladanSettings
    {
        public List<string> NodesUrls { get; set; }
        public string MongoDbConnectionString { get; set; }
        public string MongoDbName { get; set; }
        public int MaxCpuThreads { get; set; }
    }
}
