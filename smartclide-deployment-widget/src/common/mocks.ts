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
    arr.push({
      id: Math.ceil(Math.random() * 999),
      state: randomState(),
      username: 'pberr',
      repository: 'test-kubernentes',
      branch: faker.git.branch(),
      created: faker.date.past(2, 'Y-m-d 2 H:i:s').toString(),
      updated: faker.date.past(2, 'Y-m-d 2 H:i:s').toString(),
    });
  }
  return arr;
};
