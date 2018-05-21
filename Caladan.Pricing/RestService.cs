using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Caladan.Pricing
{
    /// <summary>
    /// RestService class.
    /// </summary>
    /// <typeparam name="RequestT">The type of the request t.</typeparam>
    /// <typeparam name="ResponseT">The type of the response t.</typeparam>
    /// <seealso cref="System.IDisposable" />
    public class RestService<RequestT, ResponseT> : IDisposable where RequestT : class
    {
        private bool _disposed;

        /// <summary>
        /// Initializes a new instance of the <see cref="RestService{RequestT, ResponseT}"/> class.
        /// </summary>
        /// <param name="apiResource">The API resource.</param>
        public RestService(string apiResource)
        {
            _apiResource = apiResource;
        }

        private string _apiResource { get; set; }

        /// <summary>
        /// Executes a GET request asynchronous.
        /// </summary>
        /// <returns></returns>
        public async Task<ResponseT> GetAsync() => await CallRestServiceAsync(HttpMethod.Get);

        /// <summary>
        /// Calls a rest service asynchronous.
        /// </summary>
        /// <param name="method">The method.</param>
        /// <returns></returns>
        private async Task<ResponseT> CallRestServiceAsync(HttpMethod method) => await CallRestServiceAsync(method, null);

        /// <summary>
        /// Calls the a service asynchronous.
        /// </summary>
        /// <param name="method">The method.</param>
        /// <param name="entity">The entity.</param>
        /// <returns></returns>
        private async Task<ResponseT> CallRestServiceAsync(HttpMethod method, RequestT entity)
        {
            using (var client = new HttpClient())
            {
                var result = await client.GetAsync(_apiResource);
                var content = await result.Content.ReadAsStringAsync();

                return JsonConvert.DeserializeObject<ResponseT>(content);
            }
        }

        #region Disposable implementation
        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Releases unmanaged and - optionally - managed resources.
        /// </summary>
        /// <param name="disposing"><c>true</c> to release both managed and unmanaged resources; <c>false</c> to release only unmanaged resources.</param>
        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
                return;

            if (disposing)
            {
                //Free other managed objects that implement IDisposable only
            }

            _apiResource = null;

            _disposed = true;
        }
        #endregion
    }
}
