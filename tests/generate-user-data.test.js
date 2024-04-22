import fs from "fs";
import nock from "nock";

import { generateUserData } from "../src/helpers/generate-user-data.js";
import { UsersService } from "../src/services/users-service.js";
import { ItemsService } from "../src/services/items-service.js";
import { TransactionsService } from "../src/services/transactions-service.js";
import { AccountsService } from "../src/services/accounts-service.js";
import { HttpClient } from "../src/services/http-client.js";

import { secondUser, thirdUser, fourthUser } from "./data/users.js";
import { firstItem } from "./data/items.js";
import { firstAccount, thirdAccount } from "./data/accounts.js";
import {
  firstTransaction,
  secondTransaction,
  thirdTransaction,
} from "./data/transactions.js";

describe("generateUserData", () => {
  let httpClient;
  let usersService;
  let itemsService;
  let transactionsService;
  let accountsService;

  beforeAll(() => {
    if (!fs.existsSync("./tests/fixtures")) {
      fs.mkdirSync("./tests/fixtures");
    }

    nock("https://api.bridgeapi.io")
      .get("/v2/users")
      .reply(200, {
        resources: [
          {
            email: "linna@email.com",
            uuid: "uuid",
          },
          secondUser,
          thirdUser,
          fourthUser,
        ],
        pagination: {
          next_uri: null,
        },
      });

    nock("https://api.bridgeapi.io")
      .post(
        "/v2/authenticate",
        (body) =>
          body &&
          body["email"] === "linna@email.com" &&
          body["password"] === "password123" &&
          body["user_uuid"] === "uuid"
      )
      .reply(200, { access_token: "access_token", expires_at: "2022-01-01" });

    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/items?limit=500")
      .reply(200, {
        resources: [firstItem],
        pagination: {
          next_uri: null,
        },
      });

    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/accounts?item_id=123456&&limit=500")
      .reply(200, {
        resources: [firstAccount, thirdAccount],
        pagination: {
          next_uri: null,
        },
      });

    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/transactions?limit=2")
      .reply(200, {
        resources: [firstTransaction, secondTransaction],
        pagination: {
          next_uri: null,
        },
      });

    httpClient = new HttpClient(
      "https://api.bridgeapi.io",
      "1234",
      "5678",
      "2021-06-01"
    );
    usersService = new UsersService(httpClient);
    itemsService = new ItemsService(httpClient);
    transactionsService = new TransactionsService(httpClient);
    accountsService = new AccountsService(httpClient);
  });

  it("should return the correct data", async () => {
    const email = "linna@email.com";
    const password = "password123";
    const jsonFilePath = "./tests/fixtures/bridge-api-results.json";

    const formattedTokenInfo = {
      value: "access_token",
      expires_at: "2022-01-01",
    };

    const formattedFirstItem = {
      ...firstItem,
      accounts: [
        {
          id: firstAccount.id,
          name: firstAccount.name,
          balance: firstAccount.balance,
          status: firstAccount.status,
          status_code_info: firstAccount.status_code_info,
          status_code_description: firstAccount.status_code_description,
          updated_at: firstAccount.updated_at,
          type: firstAccount.type,
          currency_code: firstAccount.currency_code,
          iban: firstAccount.iban,
        },
        {
          id: thirdAccount.id,
          name: thirdAccount.name,
          balance: thirdAccount.balance,
          status: thirdAccount.status,
          status_code_info: thirdAccount.status_code_info,
          status_code_description: thirdAccount.status_code_description,
          updated_at: thirdAccount.updated_at,
          type: thirdAccount.type,
          currency_code: thirdAccount.currency_code,
          iban: thirdAccount.iban,
        },
      ],
    };

    const formattedTransactions = [
      {
        id: firstTransaction.id,
        clean_description: firstTransaction.clean_description,
        bank_description: firstTransaction.bank_description,
        amount: firstTransaction.amount,
        date: firstTransaction.date,
        updated_at: firstTransaction.updated_at,
        currency_code: firstTransaction.currency_code,
        is_deleted: firstTransaction.is_deleted,
        category_id: firstTransaction.category_id,
        account_id: firstTransaction.account_id,
        is_future: firstTransaction.is_future,
        show_client_side: firstTransaction.show_client_side,
      },
      {
        id: secondTransaction.id,
        clean_description: secondTransaction.clean_description,
        bank_description: secondTransaction.bank_description,
        amount: secondTransaction.amount,
        date: secondTransaction.date,
        updated_at: secondTransaction.updated_at,
        currency_code: secondTransaction.currency_code,
        is_deleted: secondTransaction.is_deleted,
        category_id: secondTransaction.category_id,
        account_id: secondTransaction.account_id,
        is_future: secondTransaction.is_future,
        show_client_side: secondTransaction.show_client_side,
      },
    ];

    const expectedContent = {
      access_token: formattedTokenInfo,
      items: [formattedFirstItem],
      transactions: formattedTransactions,
    };

    await generateUserData(
      usersService,
      itemsService,
      transactionsService,
      accountsService,
      email,
      password,
      jsonFilePath
    );

    const fileExists = fs.existsSync(jsonFilePath);
    expect(fileExists).toBe(true);

    const exportedJson = JSON.parse(
      fs.readFileSync("./tests/fixtures/bridge-api-results.json", "utf8")
    );
    expect(exportedJson).toStrictEqual(expectedContent);
  });
});
