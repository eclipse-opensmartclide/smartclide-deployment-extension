import { BASE_URL } from './constants';

export const postBuild = async (
  project: string,
  token: string,
  branch: string,
  yml: string
): Promise<Record<string, any>> => {
  return await fetch(`${BASE_URL}/builds?project=${project}&branch=${branch}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-token': token,
    },
    body: yml,
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => {
      return err;
    });
};
export const getBuildStatus = async (
  project: string,
  token: string
): Promise<Record<string, any>> => {
  return await fetch(`${BASE_URL}/builds?project=${project}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-token': token,
    },
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => {
      return err;
    });
};
export const postDeploy = async (
  project: string,
  token: string,
  hostname: string,
  image: string,
  port: string
): Promise<Record<string, any>> => {
  return await fetch(
    `${BASE_URL}/deployments?project=${project}&hostname=${hostname}&image=${image}&port=${port}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-token': token,
      },
    }
  )
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => {
      return err;
    });
};
export const getDeployStatus = async (
  project: string,
  token: string
): Promise<Record<string, any>> => {
  return await fetch(`${BASE_URL}/deployments?project=${project}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-token': token,
    },
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => {
      return err;
    });
};
