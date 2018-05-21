using System;
using System.Collections.Generic;
using System.Text;

namespace Caladan.NodeServices.Helpers
{
    public static class Extensions
    {
        public static IEnumerable<List<T>> Split<T>(this List<T> entities, int size)
        {
            for (int i = 0; i < entities.Count; i += size)
                yield return entities.GetRange(i, Math.Min(size, entities.Count - i));
        }
    }
}
