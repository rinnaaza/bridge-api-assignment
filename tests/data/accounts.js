import { faker } from "@faker-js/faker";

const firstAccount = {
  id: faker.number.int(),
  name: faker.string.alpha(),
  balance: faker.number.float(),
  status: faker.number.int(),
  status_code_info: null,
  status_code_description: null,
  updated_at: `${faker.date.past()}`,
  type: faker.string.alpha(),
  currency_code: faker.string.alpha(),
  item_id: 123456,
  bank_id: faker.number.int(),
  loan_details: {
    next_payment_date: `${faker.date.past()}`,
    next_payment_amount: faker.number.int(),
    maturity_date: `${faker.date.past()}`,
    opening_date: `${faker.date.past()}`,
    interest_rate: faker.number.float(),
    type: faker.string.alpha(),
    borrowed_capital: faker.number.int(),
    repaid_capital: faker.number.int(),
    remaining_capital: faker.number.int()
  },
  savings_details: null,
  is_pro: false,
  iban: faker.string.alpha()
};

const secondAccount = {
  id: faker.number.int(),
  name: faker.string.alpha(),
  balance: faker.number.float(),
  status: faker.number.int(),
  status_code_info: null,
  status_code_description: null,
  updated_at: `${faker.date.past()}`,
  type: faker.string.alpha(),
  currency_code: faker.string.alpha(),
  item_id: faker.number.int(),
  bank_id: faker.number.int(),
  loan_details: {
    next_payment_date: `${faker.date.past()}`,
    next_payment_amount: faker.number.int(),
    maturity_date: `${faker.date.past()}`,
    opening_date: `${faker.date.past()}`,
    interest_rate: faker.number.float(),
    type: faker.string.alpha(),
    borrowed_capital: faker.number.int(),
    repaid_capital: faker.number.int(),
    remaining_capital: faker.number.int()
  },
  savings_details: null,
  is_pro: false,
  iban: faker.string.alpha()
};

const thirdAccount = {
  id: faker.number.int(),
  name: faker.string.alpha(),
  balance: faker.number.float(),
  status: faker.number.int(),
  status_code_info: null,
  status_code_description: null,
  updated_at: `${faker.date.past()}`,
  type: faker.string.alpha(),
  currency_code: faker.string.alpha(),
  item_id: 123456,
  bank_id: faker.number.int(),
  loan_details: {
    next_payment_date: `${faker.date.past()}`,
    next_payment_amount: faker.number.int(),
    maturity_date: `${faker.date.past()}`,
    opening_date: `${faker.date.past()}`,
    interest_rate: faker.number.float(),
    type: faker.string.alpha(),
    borrowed_capital: faker.number.int(),
    repaid_capital: faker.number.int(),
    remaining_capital: faker.number.int()
  },
  savings_details: null,
  is_pro: false,
  iban: faker.string.alpha()
};
const fourthAccount = {
  id: faker.number.int(),
  name: faker.string.alpha(),
  balance: faker.number.float(),
  status: faker.number.int(),
  status_code_info: null,
  status_code_description: null,
  updated_at: `${faker.date.past()}`,
  type: faker.string.alpha(),
  currency_code: faker.string.alpha(),
  item_id: faker.number.int(),
  bank_id: faker.number.int(),
  loan_details: {
    next_payment_date: `${faker.date.past()}`,
    next_payment_amount: faker.number.int(),
    maturity_date: `${faker.date.past()}`,
    opening_date: `${faker.date.past()}`,
    interest_rate: faker.number.float(),
    type: faker.string.alpha(),
    borrowed_capital: faker.number.int(),
    repaid_capital: faker.number.int(),
    remaining_capital: faker.number.int()
  },
  savings_details: null,
  is_pro: false,
  iban: faker.string.alpha()
};

export { firstAccount, secondAccount, thirdAccount, fourthAccount };