import nock from "nock";

import { UsersService } from "../src/services/users-service.js";
import { HttpClient } from "../src/services/http-client.js";
import { firstUser, secondUser, thirdUser, fourthUser, fifthUser, sixthUser } from "./data/users.js";

describe("UsersService: authenticateUser()", () => {
  let usersService;

  beforeEach(() => {
    nock("https://api.bridgeapi.io")
    .post("/v2/authenticate", (body) => 
      (
        body 
        && (body["email"] === "john.doe@email.com" && body["password"] === "password123")
        && (body["user_uuid"] === "uuid" || body["external_user_id"] === "external_user_id")
    ))
    .reply(200, { access_token: "access_token", expires_at: "2022-01-01" });

    const baseUrl = "https://api.bridgeapi.io";
    const clientId = "1234";
    const clientSecret = "5678";
    const bridgeVersion = "2021-06-01";

    const httpClient = new HttpClient(baseUrl, clientId, clientSecret, bridgeVersion);
    usersService = new UsersService(httpClient);
  });

  it("should throw an error when uuid and externalUserId are not provided", async () => {
    await expect(
      usersService.authenticateUser({ email: "john.doe@email.com", password: "password123" })
    ).rejects.toThrow("Please provide either externalUserId or userUUID of the user");
  });

  it("should throw an error when invalid uuid", async () => {
    await expect(
      usersService.authenticateUser({ uuid: "invalid_uuid", email: "john.doe@email.com", password: "password123" })
    ).rejects.toThrow(Error);
  });

  it("should throw an error when invalid externalUserId", async () => {
    await expect(
      usersService.authenticateUser({ externalUserId: "invalid_external_user_id", email: "john.doe@email.com", password: "password123" })
    ).rejects.toThrow(Error);
  });

  it("should throw an error when missing email and password", async () => {
    await (expect(
      usersService.authenticateUser({ uuid: "uuid" })
    )).rejects.toThrow("Please provide email and password of the user");
  });

  it("should throw an error when missing email", async () => {
    await (expect(
      usersService.authenticateUser({ uuid: "uuid", password: "password123" })
    )).rejects.toThrow("Please provide email and password of the user");
  });

  it("should throw an error when missing password", async () => {
    await (expect(
      usersService.authenticateUser({ uuid: "uuid", email: "john.doe@email.com" })
    )).rejects.toThrow("Please provide email and password of the user");
  });

  it("should throw an error when invalid email and password", async () => {
    await (expect(
      usersService.authenticateUser({ uuid: "uuid", email: "invalid_email@email.com", password: "invalid_password" })
    )).rejects.toThrow(Error);
  });

  it("should throw an error when invalid email", async () => {
    await (expect(
      usersService.authenticateUser({ uuid: "uuid", email: "invalid_email@email.com", password: "password123" })
    )).rejects.toThrow(Error);
  });

  it("should throw an error when invalid password", async () => {
    await (expect(
      usersService.authenticateUser({ uuid: "uuid", email: "john.doe@email.com", password: "invalid_password" })
    )).rejects.toThrow(Error);
  });

  it("should return access_token and expires_at when uuid is provided", async () => {
    const token = await usersService.authenticateUser({ uuid: "uuid", email: "john.doe@email.com", password: "password123" });

    expect(token).toEqual({ access_token: "access_token", expires_at: "2022-01-01" }); 
  });

  it("should return access_token and expires_at when externalUserId is provided", async () => {
    const token = await usersService.authenticateUser({ externalUserId: "external_user_id", email: "john.doe@email.com", password: "password123" });

    expect(token).toEqual({ access_token: "access_token", expires_at: "2022-01-01" }); 
  });
});

describe("UsersService: listUsers()", () => {
  let usersService;

  beforeEach(() => {
    nock("https://api.bridgeapi.io")
    .get("/v2/users")
    .reply(200, {
      "resources": [
        firstUser,
        secondUser,
        thirdUser,
        fourthUser,
      ],
      "pagination": {
        "next_uri": "/v2/users?after=next_uri",    
      }
    });

    nock("https://api.bridgeapi.io")
    .get("/v2/users")
    .query({ after: "next_uri" })
    .reply(200, {
      "resources": [
        fifthUser,
        sixthUser
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    nock("https://api.bridgeapi.io")
    .get("/v2/users")
    .query({ limit: 2 })
    .reply(200, {
      "resources": [
        firstUser,
        secondUser
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    nock("https://api.bridgeapi.io")
    .get("/v2/users")
    .query({ after: "next_uri", limit: 1 })
    .reply(200, {
      "resources": [
        fifthUser,
      ],
      "pagination": {
        "next_uri": null,    
      }
    });

    nock("https://api.bridgeapi.io")
    .get("/v2/users")
    .query({ after: "invalid_uri" })
    .reply(200, {
      "resources": [
        firstUser,
        secondUser,
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
    usersService = new UsersService(httpClient);
  });

  it("should return an array of all users if no parameters", async () => {
    const users = await usersService.listUsers();

    expect(users).toHaveLength(4);
    expect(users).toStrictEqual([
      firstUser,
      secondUser,
      thirdUser,
      fourthUser
    ])
  });

  it("should handle pagination if after parameter is provided", async () => {
    const users = await usersService.listUsers({ after: "next_uri" });

    expect(users).toHaveLength(2);
    expect(users).toStrictEqual([
      fifthUser,
      sixthUser,
    ])
  });

  it("should handle limit when limit parameter is provided", async () => {
    const users = await usersService.listUsers({ limit: 2 });
    
    expect(users).toHaveLength(2);
    expect(users).toStrictEqual([
      firstUser,
      secondUser
    ]);
  });

  it("should handle pagination and limit when limit and after parameters are provided", async () => {
    const users = await usersService.listUsers({ after: "next_uri", limit: 1 });
    
    expect(users).toHaveLength(1);
    expect(users).toStrictEqual([
      fifthUser,
    ]);
  });

  it("should return users if after parameter doesn't exist", async () => {
    const users = await usersService.listUsers({ after: "invalid_uri" })

    expect(users).toHaveLength(2);
    expect(users).toStrictEqual([
      firstUser,
      secondUser,
    ]);
  });
});

describe("UsersService: getUserIdByEmail()", () => {
  let usersService;

  beforeEach(() => {
    nock("https://api.bridgeapi.io")
    .get("/v2/users")
    .reply(200, {
      "resources": [
        firstUser,
        secondUser,
        thirdUser,
        fourthUser,
        fifthUser,
        sixthUser,
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
    usersService = new UsersService(httpClient);
  });

  it("should return the id of a valid email", async () => {
    const userId = await usersService.getUserIdByEmail({ email: "user1@email.com" });

    expect(userId).toBe("user_uuid_1");
  });

  it("should throw an error if email is not provided", async () => {
    await expect(usersService.getUserIdByEmail()).rejects.toThrow("Please provide an email");
  });

  it("should return null if email is invalid", async () => {
    const userId = await usersService.getUserIdByEmail({ email: "invalid_user@email.com" });
    
    expect(userId).toBeNull();
  });

  it("should return null if list of users is empty", async () => {
    nock("https://api.bridgeapi_empty_resources.io")
    .get("/v2/users")
    .reply(200, {
      "resources": [],
      "pagination": {
        "next_uri": null,    
      }
    });

    const baseUrlForEmptyResources = "https://api.bridgeapi_empty_resources.io";
    const clientId = "1234";
    const clientSecret = "5678";
    const bridgeVersion = "2021-06-01";

    const httpClientForEmptyResources = new HttpClient(baseUrlForEmptyResources, clientId, clientSecret, bridgeVersion);
    const usersServiceForEmptyResources = new UsersService(httpClientForEmptyResources);

    const userId = await usersServiceForEmptyResources.getUserIdByEmail({ email: "user1@email.com" });

    expect(userId).toBeNull();
  });
});
