import superagent from "superagent";

class MissingRequiredHeaders extends Error {
  constructor(message) {
    super(message);
  }
}

class HttpClient {
  #baseUrl;
  #clientId;
  #clientSecret;
  #bridgeVersion;

  /**
   * Instanciates a new httpClient class.
   * @param {string} baseURL - Path to the API.
   * @param {string} clientId - Application's client id.
   * @param {string} clientSecret - Application's client secret.
   * @param {string} bridgeVersion - Version of the bridge.
   */
  constructor(baseUrl, clientId, clientSecret, bridgeVersion) {
    this.#baseUrl = baseUrl;
    this.#clientId = clientId;
    this.#clientSecret = clientSecret;
    this.#bridgeVersion = bridgeVersion;
  }

  /**
   * Ensures that each request includes the required headers for it to be successful.
   * @throws {Error} - Reponse error.
   */
  #checkAuthenticationHeaders() {
    let missingRequiredHeaders = [];

    if (!this.#clientId) missingRequiredHeaders.push("Client-Id");

    if (!this.#clientSecret) missingRequiredHeaders.push("Client-Secret");

    if (!this.#bridgeVersion) missingRequiredHeaders.push("Bridge-Version");

    if (missingRequiredHeaders.length > 0) {
      throw new MissingRequiredHeaders(
        `The following required headers are missing: ${missingRequiredHeaders.join(", ")}`
      );
    }
  }

  /**
   * Sends post request to the API.
   * @param {object} options
   * @param {string} options.endpoint - Path of the API endpoint.
   * @param {object} options.params - Params object of the API.
   * @param {object} options.headers - Headers object of the API.
   * @param {object} options.requestBody - Request body object of the API.
   * @returns {Promise<object>} - Response body object.
   * @throws {Error} - Reponse error.
   */
  async post({ endpoint, params, headers, requestBody }) {
    const url = `${this.#baseUrl}${endpoint}`;

    this.#checkAuthenticationHeaders();

    const response = await superagent
      .post(url)
      .query(params)
      .set({
        ...headers,
        "Client-Id": this.#clientId,
        "Client-Secret": this.#clientSecret,
        "Bridge-Version": this.#bridgeVersion,
      })
      .send(requestBody);

    return response;
  }

  /**
   * Sends get request to the API.
   * @param {object} options
   * @param {string} options.endpoint - Path of the API endpoint.
   * @param {object} options.params - Params object of the API.
   * @param {object} options.headers - Headers object of the API.
   * @param {object} options.requestBody - Request body object of the API.
   * @returns {Promise<object>} - Response body object.
   * @throws {Error} - Reponse error.
   */
  async get({ endpoint, params, headers, requestBody }) {
    const url = `${this.#baseUrl}${endpoint}`;

    this.#checkAuthenticationHeaders();

    const response = await superagent
      .get(url)
      .query(params)
      .set({
        ...headers,
        "Client-Id": this.#clientId,
        "Client-Secret": this.#clientSecret,
        "Bridge-Version": this.#bridgeVersion,
      })
      .send(requestBody);

    return response;
  }
}

export { HttpClient, MissingRequiredHeaders };
