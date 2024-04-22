class AccountsService {
    #httpClient;
  
    /**
     * Instanciates a new AccountsService class.
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
    #getAllAccounts = async({ endpoint, headers, params }) => {
      const accounts = [];
      
      let response = await this.#httpClient.get({ endpoint, headers, params: {...params, limit: 500 } });
      accounts.push(...response.body.resources);
        
      while(response?.body?.pagination?.next_uri) {
        response = await this.#httpClient.get({ endpoint: response.body.pagination.next_uri, headers, params: {...params, limit: 500 } });
        accounts.push(...response.body.resources);
      }
  
      return accounts;
    }
  
    /**
     * Returns list of accounts.
     * @param {object} options
     * @param {string} options.accessToken - Secret access token.
     * @param {string} options.itemId - Get accounts of a specific item id.
     * @param {string} options.after - Cursor to point to the start of the desired set.
     * @param {number} options.limit - Limit of accounts to return.
     * @param {boolean} options.fetchAll - Whether it should fetch all data or not.
     * @returns {Promise<Array>} Array of accounts.
     */
    async listAccounts({ accessToken, itemId, after, limit, fetchAll = false } = {}) {
      const endpoint = "/v2/accounts";
  
      if (!accessToken) {
        throw new Error("Required access token is missing");
      }
      
      const headers = {
        "Authorization": `Bearer ${accessToken}`,
      };
  
      const params = {  
        "item_id": itemId,
        "after": after,
        "limit": limit,
      };
  
      if (fetchAll) {
        return await this.#getAllAccounts({ endpoint, headers, params });
      }

      const response = await this.#httpClient.get({ endpoint, headers, params });

      return response.body.resources;
    }
  }
  
  export { AccountsService };
  