import * as faker from 'faker';

interface Build {
  id: number;
  state: string;
  username: string;
  repository: string;
  branch: string;
  created: string;
  updated: string;
}

const randomState = () => {
  const enumState = ['-', 'error', 'running', 'pending'];
  return enumState[Math.ceil(Math.random() * 3)];
};

export const randomBuilds = (): Build[] => {
  const arr: Build[] = [];
  for (let index = 0; index < 50; index++) {
    const created = new Date(faker.date.past());
    const updated = new Date(faker.date.recent());

    arr.push({
      id: index * 63,
      state: randomState(),
      username: 'pberr',
      repository: 'test-kubernentes',
      branch: faker.git.branch(),
      created: `${
        created.getDay() < 10 ? '0' + created.getDay() : created.getDay()
      }-${
        created.getMonth() < 10 ? '0' + created.getMonth() : created.getMonth()
      }-${created.getFullYear()}`,
      updated: `${
        updated.getDay() < 10 ? '0' + updated.getDay() : updated.getDay()
      }-${
        updated.getMonth() < 10 ? '0' + updated.getMonth() : updated.getMonth()
      }-${updated.getFullYear()}`,
    });
  }
  return arr;
};
