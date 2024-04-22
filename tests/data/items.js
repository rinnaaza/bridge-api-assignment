import { faker } from "@faker-js/faker";

const createItem = () => {
  return {
    id: faker.number.int(),
    status: faker.number.int(),
    status_code_info: faker.string.alpha(),
    status_code_description: faker.string.alpha(),
    bank_id: faker.number.int(),
  };
};

const firstItem = {
  id: 123456,
  status: faker.number.int(),
  status_code_info: faker.string.alpha(),
  status_code_description: faker.string.alpha(),
  bank_id: faker.number.int(),
};
const secondItem = createItem();
const thirdItem = createItem();
const fourthItem = createItem();

export { firstItem, secondItem, thirdItem, fourthItem };
