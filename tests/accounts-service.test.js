import nock from "nock";

import { AccountsService } from "../src/services/accounts-service";
import { HttpClient } from "../src/services/http-client";
import {
  firstAccount,
  secondAccount,
  thirdAccount,
  fourthAccount,
} from "./data/accounts.js";

describe("AccountsService: listAccounts()", () => {
  let accountsService;

  beforeAll(() => {
    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/accounts")
      .reply(200, {
        resources: [firstAccount, secondAccount],
        pagination: {
          next_uri: "/v2/accounts?after=next_uri",
        },
      });

    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/accounts?after=next_uri")
      .reply(200, {
        resources: [thirdAccount, fourthAccount],
        pagination: {
          next_uri: null,
        },
      });

    const baseUrl = "https://api.bridgeapi.io";
    const clientId = "1234";
    const clientSecret = "5678";
    const bridgeVersion = "2021-06-01";

    const httpClient = new HttpClient(
      baseUrl,
      clientId,
      clientSecret,
      bridgeVersion
    );
    accountsService = new AccountsService(httpClient);
  });

  it("should return all accounts of the first page", async () => {
    const accounts = await accountsService.listAccounts({
      accessToken: "access_token",
    });

    expect(accounts).toHaveLength(2);
    expect(accounts).toStrictEqual([firstAccount, secondAccount]);
  });

  it("should return all accounts of the first page", async () => {
    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/accounts?limit=500")
      .reply(200, {
        resources: [firstAccount, secondAccount],
        pagination: {
          next_uri: "/v2/accounts?after=next_uri",
        },
      });

    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/accounts?after=next_uri&&limit=500")
      .reply(200, {
        resources: [thirdAccount, fourthAccount],
        pagination: {
          next_uri: null,
        },
      });

    const accounts = await accountsService.listAccounts({
      accessToken: "access_token",
      fetchAll: true,
    });

    expect(accounts).toHaveLength(4);
    expect(accounts).toStrictEqual([
      firstAccount,
      secondAccount,
      thirdAccount,
      fourthAccount,
    ]);
  });

  it("should throw an error if accessToken is not provided", async () => {
    await expect(accountsService.listAccounts()).rejects.toThrow(
      "Required access token is missing"
    );
  });

  it("should return list of 3 accounts when limit is equal to 3", async () => {
    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/accounts?limit=3")
      .reply(200, {
        resources: [firstAccount, secondAccount, thirdAccount],
        pagination: {
          next_uri: null,
        },
      });

    const accounts = await accountsService.listAccounts({
      accessToken: "access_token",
      limit: 3,
    });

    expect(accounts).toHaveLength(3);
    expect(accounts).toStrictEqual([firstAccount, secondAccount, thirdAccount]);
  });

  it("shoudl handle pagination when after parameter is provided", async () => {
    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/accounts?after=next_uri")
      .reply(200, {
        resources: [thirdAccount, fourthAccount],
        pagination: {
          next_uri: null,
        },
      });

    const accounts = await accountsService.listAccounts({
      accessToken: "access_token",
      after: "next_uri",
    });

    expect(accounts).toHaveLength(2);
    expect(accounts).toStrictEqual([thirdAccount, fourthAccount]);
  });

  it("should handle limit when limit parameter is provided", async () => {
    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/accounts?limit=1")
      .reply(200, {
        resources: [firstAccount],
        pagination: {
          next_uri: null,
        },
      });

    const accounts = await accountsService.listAccounts({
      accessToken: "access_token",
      limit: 1,
    });

    expect(accounts).toHaveLength(1);
    expect(accounts).toStrictEqual([firstAccount]);
  });

  it("should handle limit and pagination when limit and after parameters are provided", async () => {
    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/accounts?limit=1&&after=next_uri")
      .reply(200, {
        resources: [thirdAccount],
        pagination: {
          next_uri: null,
        },
      });

    const accounts = await accountsService.listAccounts({
      accessToken: "access_token",
      after: "next_uri",
      limit: 1,
    });

    expect(accounts).toHaveLength(1);
    expect(accounts).toStrictEqual([thirdAccount]);
  });

  it("should return all the accounts if limit is greater than number of accounts", async () => {
    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/accounts?limit=10")
      .reply(200, {
        resources: [firstAccount, secondAccount, thirdAccount, fourthAccount],
        pagination: {
          next_uri: null,
        },
      });

    const accounts = await accountsService.listAccounts({
      accessToken: "access_token",
      limit: 10,
    });

    expect(accounts).toHaveLength(4);
    expect(accounts).toStrictEqual([
      firstAccount,
      secondAccount,
      thirdAccount,
      fourthAccount,
    ]);
  });

  it("should return all the accounts if after parameter doesn't exist", async () => {
    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/accounts?after=invalid_uri")
      .reply(200, {
        resources: [firstAccount, secondAccount, thirdAccount, fourthAccount],
        pagination: {
          next_uri: null,
        },
      });

    const accounts = await accountsService.listAccounts({
      accessToken: "access_token",
      after: "invalid_uri",
    });

    expect(accounts).toHaveLength(4);
    expect(accounts).toStrictEqual([
      firstAccount,
      secondAccount,
      thirdAccount,
      fourthAccount,
    ]);
  });

  it("should return corresponding account when valid itemId parameter is provided", async () => {
    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/accounts?item_id=123456")
      .reply(200, {
        resources: [firstAccount, thirdAccount],
        pagination: {
          next_uri: null,
        },
      });

    const accounts = await accountsService.listAccounts({
      accessToken: "access_token",
      itemId: 123456,
    });

    expect(accounts).toHaveLength(2);
    expect(accounts).toStrictEqual([firstAccount, thirdAccount]);
  });

  it("should return an empty array if there are no corresponding accounts to a provided itemId", async () => {
    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/accounts?item_id=654321")
      .reply(200, {
        resources: [],
        pagination: {
          next_uri: null,
        },
      });

    const accounts = await accountsService.listAccounts({
      accessToken: "access_token",
      itemId: 654321,
    });

    expect(accounts).toHaveLength(0);
    expect(accounts).toStrictEqual([]);
  });

  it("should return corresponding account when limit and itemId parameters are provided", async () => {
    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/accounts?item_id=123456&&limit=1")
      .reply(200, {
        resources: [firstAccount],
        pagination: {
          next_uri: null,
        },
      });

    const accounts = await accountsService.listAccounts({
      accessToken: "access_token",
      limit: 1,
      itemId: 123456,
    });

    expect(accounts).toHaveLength(1);
    expect(accounts).toStrictEqual([firstAccount]);
  });

  it("should return corresponding account when limit and itemId and after parameters are provided", async () => {
    nock("https://api.bridgeapi.io", {
      reqheaders: {
        Authorization: "Bearer access_token",
      },
    })
      .get("/v2/accounts?item_id=123456&&limit=1&&after=next_uri")
      .reply(200, {
        resources: [thirdAccount],
        pagination: {
          next_uri: null,
        },
      });

    const accounts = await accountsService.listAccounts({
      accessToken: "access_token",
      limit: 1,
      itemId: 123456,
      after: "next_uri",
    });

    expect(accounts).toHaveLength(1);
    expect(accounts).toStrictEqual([thirdAccount]);
  });
});
