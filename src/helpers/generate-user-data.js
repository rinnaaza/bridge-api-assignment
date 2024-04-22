import { JsonExporter } from "./json-exporter.js";

/**
 * Generate json file containing information retrieved from Bridge api to a given path.
 * @param {object} usersService - class instance of UsersService.
 * @param {object} itemsService - class instance of ItemsService.
 * @param {object} transactionsService - class instance of TransactionsService.
 * @param {object} accountsService - class instance of AccountsService.
 * @param {string} email - email of user.
 * @param {string} password - Password of user.
 * @param {string} jsonFilePath - Path of the json file we want to generate. 
 */
const generateUserData = async (usersService, itemsService, transactionsService, accountsService, email, password, jsonFilePath) => {
  // Get userId by email and authorize the user
  const uuid = await usersService.getUserIdByEmail({ email });

  const tokenInfo = await usersService.authenticateUser({ uuid, email, password });
  const accessToken = tokenInfo.access_token;

  // Get all the items and all the accounts for each item
  const itemsList = await itemsService.listItems({ accessToken, fetchAll: true });

  const items = await itemsList.reduce(async (items, item) => {
      const accountsList = await accountsService.listAccounts({ accessToken, itemId: item.id, fetchAll: true });
      return ([...items, { ...item, accounts: accountsList }])
  }, []);

  // Get last two transactions
  const transactionsList = await transactionsService.listTransactions({ accessToken, limit: 2 });

  // Export data to JSON
  const jsonExporter = new JsonExporter(tokenInfo, items, transactionsList);
  jsonExporter.export(jsonFilePath);
};

export { generateUserData };