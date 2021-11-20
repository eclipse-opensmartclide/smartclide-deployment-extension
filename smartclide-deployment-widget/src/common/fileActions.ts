import { readFile } from 'fs';

export const fileRead = (filename: string): any => {
  return readFile(filename, 'utf8', (err, data) => {
    if (err) {
      return err;
    }
    return data;
  });
};
