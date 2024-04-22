import fs from "fs";

class JsonExporter {
  #tokenInfo;
  #items;
  #transactions;

  /**
   * Instantiates a new JsonExporter
   * @param {object} tokenInfo - User token info.
   * @param {object} items - List of Items.
   * @param {object} transactions - List of transactions.
   */
  constructor(tokenInfo, items, transactions) {
    this.#tokenInfo = tokenInfo;
    this.#items = items;
    this.#transactions = transactions;
  }

  /**
   * Returns an object with formatted token infos, items and transactions.
   * @private
   * @returns {object} - Object containing token infos, items and transactions.
   */
  #formatData() {
    const formattedTokenInfo = {
      value: this.#tokenInfo.access_token,
      expires_at: this.#tokenInfo.expires_at,
    };

    const formattedItems = this.#items.map((item) => ({
      ...item,
      accounts: item.accounts.map((account) => ({
        id: account.id,
        name: account.name,
        balance: account.balance,
        status: account.status,
        status_code_info: account.status_code_info,
        status_code_description: account.status_code_description,
        updated_at: account.updated_at,
        type: account.type,
        currency_code: account.currency_code,
        iban: account.iban,
      })),
    }));

    const formattedTransactions = this.#transactions.map((transaction) => ({
      id: transaction.id,
      clean_description: transaction.clean_description,
      bank_description: transaction.bank_description,
      amount: transaction.amount,
      date: transaction.date,
      updated_at: transaction.updated_at,
      currency_code: transaction.currency_code,
      is_deleted: transaction.is_deleted,
      category_id: transaction.category_id,
      account_id: transaction.account_id,
      is_future: transaction.is_future,
      show_client_side: transaction.show_client_side,
    }));

    return {
      access_token: formattedTokenInfo,
      items: formattedItems,
      transactions: formattedTransactions,
    };
  }

  /**
   * Generates a JSON file at a specific path.
   * @param {string} path - Path to the JSON file.
   */
  export(path) {
    if (!path) {
      throw new Error("Required path is missing");
    }

    const dataToExport = this.#formatData();
    const jsonData = JSON.stringify(dataToExport, null, 2);

    const filePath = path;
    fs.writeFileSync(filePath, jsonData, (err) => {
      if (err) {
        console.error("Error writing JSON file", err);
      }
    });
  }
}

export { JsonExporter };
