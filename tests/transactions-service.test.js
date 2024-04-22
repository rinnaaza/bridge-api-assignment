import nock from "nock";

import { TransactionsService } from "../src/services/transactions-service";
import { HttpClient } from "../src/services/http-client";
import { firstTransaction, secondTransaction, thirdTransaction, fourthTransaction  } from "./data/transactions.js";

describe("TransactionsService: listTransactions()", () => {
  let transactionsService;

  beforeAll(() => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions")
    .reply(200, {
      "resources": [
        firstTransaction,
        secondTransaction,
      ],
      "pagination": {
        "next_uri": "/v2/transactions?after=next_uri",    
      }
    });

    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions?after=next_uri")
    .reply(200, {
      "resources": [
        thirdTransaction,
        fourthTransaction,
      ],
      "pagination": { 
        "next_uri": null,
      }
    });

    const baseUrl = "https://api.bridgeapi.io";
    const clientId = "1234";
    const clientSecret = "5678";
    const bridgeVersion = "2021-06-01";

    const httpClient = new HttpClient(baseUrl, clientId, clientSecret, bridgeVersion);
    transactionsService = new TransactionsService(httpClient);
  });

  it("should return all the transactions of the first page", async() => {
    const transactions = await transactionsService.listTransactions({ accessToken: "access_token" });

    expect(transactions).toHaveLength(2);
    expect(transactions).toStrictEqual([
      firstTransaction,
      secondTransaction,
    ]);
  });

  it("should return all the transactions of the first page", async() => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions?limit=500")
    .reply(200, {
      "resources": [
        firstTransaction,
        secondTransaction,
      ],
      "pagination": {
        "next_uri": "/v2/transactions?after=next_uri",    
      }
    });

    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions?after=next_uri&&limit=500")
    .reply(200, {
      "resources": [
        thirdTransaction,
        fourthTransaction,
      ],
      "pagination": { 
        "next_uri": null,
      }
    });

    const transactions = await transactionsService.listTransactions({ accessToken: "access_token", fetchAll: true });

    expect(transactions).toHaveLength(4);
    expect(transactions).toStrictEqual([
      firstTransaction,
      secondTransaction,
      thirdTransaction,
      fourthTransaction
    ]);
  });

  it("should throw an error if accessToken is not provided", async () => {
    await expect(transactionsService.listTransactions()).rejects.toThrow("Required access token is missing");
  });

  it("should return list of 3 items when limit is equal to 3", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions")
    .query({ limit: 3 })
    .reply(200, {
      "resources": [
        firstTransaction,
        secondTransaction,
        thirdTransaction,
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const transactions = await transactionsService.listTransactions({ accessToken: "access_token", limit: 3 });

    expect(transactions).toHaveLength(3);
    expect(transactions).toStrictEqual([
      firstTransaction,
      secondTransaction,
      thirdTransaction,
    ]);
  });

  it("should handle pagination when after parameter is provided", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions")
    .query({ after: "next_uri" })
    .reply(200, {
      "resources": [
        thirdTransaction,
        fourthTransaction,
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const transactions = await transactionsService.listTransactions({ accessToken: "access_token", after: "next_uri" });

    expect(transactions).toHaveLength(2);
    expect(transactions).toStrictEqual([
      thirdTransaction,
      fourthTransaction
    ]);
  });

  it("should handle limit when limit parameter is provided", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions")
    .query({ limit: 1 })
    .reply(200, {
      "resources": [
        firstTransaction,
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const transactions = await transactionsService.listTransactions({ accessToken: "access_token", limit: 1 });

    expect(transactions).toHaveLength(1);
    expect(transactions).toStrictEqual([
      firstTransaction,
    ]);
  });

  it("should handle limit and pagination when limit and after parameters are provided", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions")
    .query({ after: "next_uri", limit: 1 })
    .reply(200, {
      "resources": [
        thirdTransaction,
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const transactions = await transactionsService.listTransactions({ accessToken: "access_token", after: "next_uri", limit: 1 });

    expect(transactions).toHaveLength(1);
    expect(transactions).toStrictEqual([
      thirdTransaction,
    ]);
  });

  it("should return all the transactions if after parameter doesn't exist", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions?after=invalid_next_uri")
    .reply(200, {
      "resources": [
        firstTransaction,
        secondTransaction,
        thirdTransaction,
        fourthTransaction,
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const transactions = await transactionsService.listTransactions({ accessToken: "access_token", after: "invalid_next_uri" });

    expect(transactions).toHaveLength(4);
    expect(transactions).toStrictEqual([
      firstTransaction,
      secondTransaction,
      thirdTransaction,
      fourthTransaction,
    ]);
  });

  it("should return all transactions if the limit is greater than number of transactions", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions")
    .query({ limit: 5 })
    .reply(200, {
      "resources": [
        firstTransaction,
        secondTransaction,
        thirdTransaction,
        fourthTransaction,
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const transactions = await transactionsService.listTransactions({ accessToken: "access_token", limit: 5 });

    expect(transactions).toHaveLength(4);
    expect(transactions).toStrictEqual([
      firstTransaction,
      secondTransaction,
      thirdTransaction,
      fourthTransaction,
    ]);
  });

  it("should return the correct transactions when since parameter is provided", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions?since=2022-04-24")
    .reply(200, {
      "resources": [
        firstTransaction,
        secondTransaction,
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const transactions = await transactionsService.listTransactions({ accessToken: "access_token", since: "2022-04-24" });

    expect(transactions).toHaveLength(2);
    expect(transactions).toStrictEqual([
      firstTransaction,
      secondTransaction,
    ]);
  });

  it("should return the correct transactions when until parameter is provided", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions?until=2022-04-22")
    .reply(200, {
      "resources": [
        fourthTransaction,
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const transactions = await transactionsService.listTransactions({ accessToken: "access_token", until: "2022-04-22" });

    expect(transactions).toHaveLength(1);
    expect(transactions).toStrictEqual([
      fourthTransaction,
    ]);
  });

  it("should return all the transactions when since parameter date is before all the transactions date", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions?since=2012-01-01")
    .reply(200, {
      "resources": [
        firstTransaction,
        secondTransaction,
        thirdTransaction,
        fourthTransaction,
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const transactions = await transactionsService.listTransactions({ accessToken: "access_token", since: "2012-01-01" });

    expect(transactions).toHaveLength(4);
    expect(transactions).toStrictEqual([
      firstTransaction,
      secondTransaction,
      thirdTransaction,
      fourthTransaction,
    ]);
  });

  it("should return empty array when since parameter date is after all the transactions date", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions?since=2024-04-21")
    .reply(200, {
      "resources": [],
      "pagination": {
        "next_uri": null,    
      }
    });

    const transactions = await transactionsService.listTransactions({ accessToken: "access_token", since: "2024-04-21" });

    expect(transactions).toHaveLength(0);
    expect(transactions).toStrictEqual([]);
  });

  it("should return empty array when until parameter date is before all the transactions date", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions?until=2012-01-01")
    .reply(200, {
      "resources": [],
      "pagination": {
        "next_uri": null,    
      }
    });

    const transactions = await transactionsService.listTransactions({ accessToken: "access_token", until: "2012-01-01" });

    expect(transactions).toHaveLength(0);
    expect(transactions).toStrictEqual([]);
  });

  it("should return all transactions when until parameter date is after all the transactions date", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions?until=2024-04-21")
    .reply(200, {
      "resources": [
        firstTransaction,
        secondTransaction,
        thirdTransaction,
        fourthTransaction,
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const transactions = await transactionsService.listTransactions({ accessToken: "access_token", until: "2024-04-21" });

    expect(transactions).toHaveLength(4);
    expect(transactions).toStrictEqual([
      firstTransaction,
      secondTransaction,
      thirdTransaction,
      fourthTransaction,
    ]);
  });

  it("should return only first transaction when until and limit parameters are provided", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions?until=2022-04-24&&limit=1")
    .reply(200, {
      "resources": [
        secondTransaction
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const transactions = await transactionsService.listTransactions({ accessToken: "access_token", limit: 1, until: "2022-04-24" });
    
    expect(transactions).toHaveLength(1);
    expect(transactions).toStrictEqual([
      secondTransaction,
    ]);
  });

  it("should return only first transaction when since and limit parameters are provided", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/transactions?since=2022-04-24&&limit=1")
    .reply(200, {
      "resources": [
        firstTransaction
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const transactions = await transactionsService.listTransactions({ accessToken: "access_token", limit: 1, since: "2022-04-24"})
    
    expect(transactions).toHaveLength(1);
    expect(transactions).toStrictEqual([
      firstTransaction,
    ]);
  });
});