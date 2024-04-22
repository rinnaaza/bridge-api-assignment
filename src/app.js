import { config } from "dotenv";

import { HttpClient } from "./services/http-client.js";
import { UsersService } from "./services/users-service.js";
import { ItemsService } from "./services/items-service.js";
import { TransactionsService } from "./services/transactions-service.js";
import { AccountsService } from "./services/accounts-service.js";

import { generateUserDate } from "./helpers/generate-user-data.js";

config();

// Get the environment variables
const baseUrl = process.env.BRIDGE_API_BASE_URL;
const clientId = process.env.BRIDGE_API_CLIENT_ID;
const clientSecret = process.env.BRIDGE_API_CLIENT_SECRET;
const bridgeVersion = process.env.BRIDGE_API_VERSION;
const email = process.env.EMAIL;
const password = process.env.PASSWORD;

// Instantiate the services
const httpClient = new HttpClient(baseUrl, clientId, clientSecret, bridgeVersion);
const usersService = new UsersService(httpClient);
const itemsService = new ItemsService(httpClient);
const transactionsService = new TransactionsService(httpClient);
const accountsService = new AccountsService(httpClient);

const jsonFilePath = "./bridge-api-results.json"

await generateUserDate(usersService, itemsService, transactionsService, accountsService, email, password, jsonFilePath);