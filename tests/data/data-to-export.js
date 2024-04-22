import { faker } from "@faker-js/faker";

import { firstTransaction, secondTransaction } from "./transactions.js";

const tokenInfo = {
  access_token: "123456",
  expires_at: "2024-04-21T19:59:28.068Z",
};

const items = [
  {
    id: faker.number.int(),
    status: faker.number.int(),
    status_code_info: faker.string.alpha(),
    status_code_description: faker.string.alpha(),
    bank_id: faker.number.int(),
    accounts: [
      {
        id: faker.number.int(),
        name: faker.string.alpha(),
        balance: faker.number.float(),
        status: faker.number.int(),
        status_code_info: null,
        status_code_description: null,
        updated_at: `${faker.date.past()}`,
        type: faker.string.alpha(),
        currency_code: faker.string.alpha(),
        iban: faker.string.alpha()
      },
      {
        id: faker.number.int(),
        name: faker.string.alpha(),
        balance: faker.number.float(),
        status: faker.number.int(),
        status_code_info: null,
        status_code_description: null,
        updated_at: `${faker.date.past()}`,
        type: faker.string.alpha(),
        currency_code: faker.string.alpha(),
        iban: faker.string.alpha()
      }
    ],
  },
];

const transactions = [
  firstTransaction,
  secondTransaction
];

export { tokenInfo, items, transactions };