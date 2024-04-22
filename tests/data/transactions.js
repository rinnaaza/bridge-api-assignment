import { faker } from "@faker-js/faker";

const firstTransaction = {
  id: faker.number.int(),
  clean_description: faker.string.alpha(),
  bank_description: faker.string.alpha(),
  amount: faker.number.int(),
  date: "2022-04-25",
  updated_at: `${faker.date.past()}`,
  currency_code: faker.string.alpha(),
  is_deleted: false,
  category_id: faker.number.int(),
  account_id: faker.number.int(),
  is_future: true,
  show_client_side: true
};

const secondTransaction = {
  id: faker.number.int(),
  clean_description: faker.string.alpha(),
  bank_description: faker.string.alpha(),
  amount: faker.number.int(),
  date: "2022-04-24",
  updated_at: `${faker.date.past()}`,
  currency_code: faker.string.alpha(),
  is_deleted: false,
  category_id: faker.number.int(),
  account_id: faker.number.int(),
  is_future: true,
  show_client_side: true
};

const thirdTransaction = {
  id: faker.number.int(),
  clean_description: faker.string.alpha(),
  bank_description: faker.string.alpha(),
  amount: faker.number.int(),
  date: "2022-04-23",
  updated_at: `${faker.date.past()}`,
  currency_code: faker.string.alpha(),
  is_deleted: false,
  category_id: faker.number.int(),
  account_id: faker.number.int(),
  is_future: true,
  show_client_side: true
};

const fourthTransaction = {
  id: faker.number.int(),
  clean_description: faker.string.alpha(),
  bank_description: faker.string.alpha(),
  amount: faker.number.int(),
  date: "2022-04-22",
  updated_at: `${faker.date.past()}`,
  currency_code: faker.string.alpha(),
  is_deleted: false,
  category_id: faker.number.int(),
  account_id: faker.number.int(),
  is_future: true,
  show_client_side: true
};

export { firstTransaction, secondTransaction, thirdTransaction, fourthTransaction };