import nock from "nock";

import { HttpClient } from "../src/services/http-client.js";
import { MissingRequiredHeaders } from "../src/services/http-client.js";

describe("HttpClient: post()", () => {
  beforeAll(() => {
    nock("https://api.bridgeapi.io", { reqheaders: {
        "Client-Id": "1234",
        "Client-Secret": "5678",
        "Bridge-Version": "2021-06-01",
      }
    })
    .post("/v2/users")
    .reply(200, { body: "Ok" });
  });

  it("should throw an error if headers are not provided", async () => {
    const baseUrl = "https://api.bridgeapi.io";
    const clientId = undefined;
    const clientSecret = undefined;
    const bridgeVersion = undefined;

    const httpClient = new HttpClient(baseUrl, clientId, clientSecret, bridgeVersion);
    
    await expect(httpClient.post({ endpoint: "/v2/users" })).rejects.toThrow(MissingRequiredHeaders);
  });
  
  it("should return a POST response", async () => {
    const httpClient = new HttpClient("https://api.bridgeapi.io", "1234", "5678", "2021-06-01");

    const response = await httpClient.post({ endpoint: "/v2/users" });

    expect(response.body).toEqual({ body: "Ok" });
  });
});

describe("HttpClient: get()", () => {
  beforeAll(() => {
    nock("https://api.bridgeapi.io", { reqheaders: {
        "Client-Id": "1234",
        "Client-Secret": "5678",
        "Bridge-Version": "2021-06-01",
      }
    })
    .get("/v2/users")
    .reply(200, { body: "Ok" });
  });

  it("should throw an error if headers are not provided", async () => {
    const baseUrl = "https://api.bridgeapi.io";
    const clientId = undefined;
    const clientSecret = undefined;
    const bridgeVersion = undefined;

    const httpClient = new HttpClient(baseUrl, clientId, clientSecret, bridgeVersion);
    
    await expect(httpClient.get({ endpoint: "/v2/users" })).rejects.toThrow(MissingRequiredHeaders);
  });

  it("should return a GET response", async () => {
    const httpClient = new HttpClient("https://api.bridgeapi.io", "1234", "5678", "2021-06-01");

    const response = await httpClient.get({ endpoint: "/v2/users" });

    expect(response.body).toEqual({ body: "Ok" });
  });
});
