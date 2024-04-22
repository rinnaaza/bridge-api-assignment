import fs from "fs";

import { JsonExporter } from "../src/helpers/json-exporter.js";
import { tokenInfo, items, transactions } from "./data/data-to-export.js";

describe("JsonExporter: export()", () => {
  let jsonExporter;

  beforeAll(() => {
    jsonExporter = new JsonExporter(tokenInfo, items, transactions);

    if (!fs.existsSync("./tests/fixtures")) {
      fs.mkdirSync("./tests/fixtures");
    }
  });

  it("should throw an error if path parameter is not provided", () => {
    expect(() => jsonExporter.export()).toThrow("Required path is missing");
  });

  it("should add a .json file in the correct path", () => {
    const path = "./tests/fixtures/example.json";
    jsonExporter.export(path);

    const formattedTokenInfo = {
      value: tokenInfo.access_token,
      expires_at: tokenInfo.expires_at,
    };

    const formattedItems = items.map((item) => ({
      id: item.id,
      status: item.status,
      status_code_info: item.status_code_info,
      status_code_description: item.status_code_description,
      bank_id: item.bank_id,
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

    const formattedTransactions = transactions.map((transaction) => ({
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

    const expectedContent = {
      access_token: formattedTokenInfo,
      items: formattedItems,
      transactions: formattedTransactions,
    };

    const fileExists = fs.existsSync(path);
    expect(fileExists).toBe(true);

    const exportedJson = JSON.parse(
      fs.readFileSync("./tests/fixtures/example.json", "utf8")
    );
    expect(exportedJson).toStrictEqual(expectedContent);
  });
});
