class TransactionsService {
  #httpClient;

  /**
   * Instanciates a new TransactionsService class.
   * @param {object} httpClient - An instance of the HttpClient class.
   */
  constructor(httpClient) {
    this.#httpClient = httpClient;
  }

  /**
   * Returns list of resources from an API.
   * @private
   * @param {object} options
   * @param {string} options.endpoint - Path of the API endpoint.
   * @param {object} options.headers - Headers object to be passed to the API.
   * @param {object} options.params - Params object to be passed to the API.
   * @returns {Promise<Array>} - Array of resources.
   */
  #getAllTransactions = async ({ endpoint, headers, params }) => {
    const transactions = [];

    let response = await this.#httpClient.get({
      endpoint,
      headers,
      params: { ...params, limit: 500 },
    });
    transactions.push(...response.body.resources);

    while (response.body.pagination.next_uri) {
      response = await this.#httpClient.get({
        endpoint: response.body.pagination.next_uri,
        headers,
        params: { ...params, limit: 500 },
      });
      transactions.push(...response.body.resources);
    }

    return transactions;
  };

  /**
   * Returns list of transactions.
   * @param {object} options
   * @param {string} options.accessToken - Secret access token.
   * @param {string} options.after - Cursor to point to the start of the desired set.
   * @param {number} options.limit - Limit of transactions to return.
   * @param {string} options.since - Filter transactions since this date.
   * @param {string} options.until - Filter transactions until this date.
   * @param {boolean} options.fetchAll - Whether it should fetch all data or not.
   * @returns {Promise<Array>} - Array of transactions.
   */
  async listTransactions({
    accessToken,
    after,
    limit,
    since,
    until,
    fetchAll = false,
  } = {}) {
    const endpoint = "/v2/transactions";

    if (!accessToken) {
      throw new Error("Required access token is missing");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const params = {
      after,
      limit,
      since,
      until,
    };

    if (fetchAll) {
      return await this.#getAllTransactions({ endpoint, headers, params });
    }

    const response = await this.#httpClient.get({ endpoint, headers, params });

    return response.body.resources;
  }
}

export { TransactionsService };
