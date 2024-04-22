class UsersService {
  #httpClient;

  /**
   * Instanciates a new UsersService class.
   * @param {object} httpClient - An instance of the HttpClient class.
   */
  constructor(httpClient) {
    this.#httpClient = httpClient;
  }

  /**
   * Returns token object containing the access token and the expiry date.
   * @param {object} options
   * @param {string} options.externalUserId - External user id of the user.
   * @param {string} options.uuid - UUID of the user.
   * @param {string} options.email - Email of the user.
   * @param {string} options.password - Password of the user.
   * @returns {Promise<object>} - Token object.
   */
  async authenticateUser({ externalUserId, uuid, email, password } = {}) {
    const endpoint = "/v2/authenticate";

    if (!externalUserId && !uuid) {
      throw Error(
        "Please provide either externalUserId or userUUID of the user"
      );
    }

    if (!email || !password) {
      throw Error("Please provide email and password of the user");
    }

    const requestBody = externalUserId
      ? {
          external_user_id: externalUserId,
          email: email,
          password: password,
        }
      : {
          user_uuid: uuid,
          email: email,
          password: password,
        };

    const response = await this.#httpClient.post({ endpoint, requestBody });

    return response.body;
  }

  /**
   * Returns list of users.
   * @param {object} options
   * @param {string} options.after - Cursor to point to the start of the desired set.
   * @param {number} options.limit - Limit of users to return.
   * @returns {Promise<Array>} - Array of users.
   */
  async listUsers({ after, limit } = {}) {
    const endpoint = "/v2/users";

    const params = {
      after: after,
      limit: limit,
    };

    const response = await this.#httpClient.get({ endpoint, params });

    return response.body.resources;
  }

  /**
   * Returns the user uuid by email.
   * @param {object} options
   * @param {string} options.email - Email of the user.
   * @returns {string} - User id.
   */
  async getUserIdByEmail({ email } = {}) {
    if (!email) {
      throw new Error("Please provide an email");
    }

    const usersList = await this.listUsers();

    const user = usersList?.find((user) => user?.email === email);

    return user?.uuid ?? null;
  }
}

export { UsersService };
