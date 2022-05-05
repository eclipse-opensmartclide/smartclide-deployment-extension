import { BASE_URL } from '../common/constants';

export const postDeploy = async (
  k8sUrl: string,
  k8sToken: string,
  project: string,
  gitLabToken: string,
  branch: string,
  replicas: string
): Promise<Record<string, any>> => {
  return await fetch(
    `${BASE_URL}/deployments?project=${project}&branch=${branch}&k8sUrl=${k8sUrl}&replicas=${replicas}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        gitLabToken: gitLabToken,
        k8sToken: k8sToken,
      },
    }
  )
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => {
      return err;
    });
};
export const getDeployStatus = async (
  k8sUrl: string,
  k8sToken: string,
  project: string,
  gitLabToken: string,
  branch: string
): Promise<Record<string, any>> => {
  return await fetch(
    `${BASE_URL}/deployments?project=${project}&branch=${branch}&k8sUrl=${k8sUrl}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        gitLabToken: gitLabToken,
        k8sToken: k8sToken,
      },
    }
  )
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => {
      return err;
    });
};

export const getBuildList = async (
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
export const getDeploymentList = async (
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
