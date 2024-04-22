import nock from "nock";

import { ItemsService } from "../src/services/items-service";
import { HttpClient } from "../src/services/http-client";
import { firstItem, secondItem, thirdItem, fourthItem } from "./data/items.js";

describe("ItemsService: listItems()", () => {
  let itemsService;

  beforeAll(() => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/items")
    .reply(200, {
      "resources": [
        firstItem,
        secondItem
      ],
      "pagination": {
        "next_uri": "/v2/items?after=next_uri",    
      }
    });

    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/items?after=next_uri")
    .reply(200, {
      "resources": [
        thirdItem,
        fourthItem,        
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
    itemsService = new ItemsService(httpClient);
  });

  it("should return all the items of the first page", async () => {
    const items = await itemsService.listItems({ accessToken: "access_token" });

    expect(items).toHaveLength(2);
    expect(items).toStrictEqual([
      firstItem,
      secondItem,
    ]);
  });

  it("should return all items when fetchAll parameter is provided", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/items?limit=500")
    .reply(200, {
      "resources": [
        firstItem,
        secondItem
      ],
      "pagination": {
        "next_uri": "/v2/items?after=next_uri",    
      }
    });

    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/items?after=next_uri&&limit=500")
    .reply(200, {
      "resources": [
        thirdItem,
        fourthItem,        
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const items = await itemsService.listItems({ accessToken: "access_token", fetchAll: true });

    expect(items).toHaveLength(4);
    expect(items).toStrictEqual([
      firstItem,
      secondItem,
      thirdItem,
      fourthItem,
    ]);
  })

  it("should throw an error if accesToken is not provided", async () => {
    await expect(itemsService.listItems()).rejects.toThrow("Required access token is missing");
  });

  it("should return list of 3 items when limit is equal to 3", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/items")
    .query({ limit: 3 })
    .reply(200, {
      "resources": [
        firstItem,
        secondItem,
        thirdItem,
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const items = await itemsService.listItems({ accessToken: "access_token", limit: 3 });

    expect(items).toHaveLength(3);
    expect(items).toStrictEqual([
      firstItem,
      secondItem,
      thirdItem
    ])
  })

  it("should handle pagination when after parameter is provided", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/items")
    .query({ after: "next_uri" })
    .reply(200, {
      "resources": [
        thirdItem,
        fourthItem,
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const items = await itemsService.listItems({ accessToken: "access_token", after: "next_uri" });

    expect(items).toHaveLength(2);
    expect(items).toStrictEqual([
      thirdItem,
      fourthItem,
    ]);
  });

  it("should handle limit when limit parameter is provided", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/items")
    .query({ limit: 1 })
    .reply(200, {
      "resources": [
        firstItem,
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const items = await itemsService.listItems({ accessToken: "access_token", limit: 1 });

    expect(items).toHaveLength(1);
    expect(items).toStrictEqual([
      firstItem,
    ]);
  });

  it("should handle limit and pagination when limit and after parameters are provided", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
        "Authorization": "Bearer access_token"
      }})
      .get("/v2/items")
      .query({ limit: 1, after: "next_uri" })
      .reply(200, {
        "resources": [
          thirdItem,
        ],
        "pagination": {
          "next_uri": null,    
        }
      });
    
    const items = await itemsService.listItems({ accessToken: "access_token", limit: 1, after: "next_uri" });

    expect(items).toHaveLength(1);
    expect(items).toStrictEqual([
      thirdItem,
    ]);
  });

  it("should return all the items if after parameter is invalid", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/items")
    .query({ after: "invalid_next_uri" })
    .reply(200, {
      "resources": [
        firstItem,
        secondItem,
        thirdItem,
        fourthItem,
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const items = await itemsService.listItems({ accessToken: "access_token", after: "invalid_next_uri" });
  
    expect(items).toHaveLength(4);
    expect(items).toStrictEqual([
      firstItem,
      secondItem,
      thirdItem,
      fourthItem,
    ]);
  });

  it("should return all items if the limit is greater than number of items", async () => {
    nock("https://api.bridgeapi.io", { reqheaders: {
      "Authorization": "Bearer access_token"
    }})
    .get("/v2/items")
    .query({ limit: 5 })
    .reply(200, {
      "resources": [
        firstItem,
        secondItem,
        thirdItem,
        fourthItem,
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    const items = await itemsService.listItems({ accessToken: "access_token", limit: 5 });

    expect(items).toHaveLength(4);
    expect(items).toStrictEqual([
      firstItem,
      secondItem,
      thirdItem,
      fourthItem,
    ])
  });
})