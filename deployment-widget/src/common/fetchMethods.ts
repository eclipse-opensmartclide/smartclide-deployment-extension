import { BASE_URL } from '../common/constants';
import { deploymentResponseData } from './ifaces';

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
    .catch((err: any): any => err);
};
export const getDeploymentStatus = async (
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
    .catch((err: any): any => err);
};
export const getDeploymentMetrics = async (
  id: string,
  k8sToken: string
): Promise<Record<string, any>> => {
  return await fetch(`${BASE_URL}/metrics/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      k8s_token: k8sToken,
    },
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => err);
};

export const getDeploymentList = async (
  user: string,
  project: string,
  limit: string,
  skip: string
): Promise<deploymentResponseData> => {
  return await fetch(
    `${BASE_URL}/deployments/?user=${user}&project=${project}&skip=${skip}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((res: any): any =>
      res.json().then((res: any): any => {
        const data = res ? res : [];
        const total = res.total ? res.total : res.length;
        return {
          data,
          total,
        };
      })
    )
    .catch((err: any): any => err);
};
export const deleteDeployment = async (
  id: string,
  k8sToken: string
): Promise<Record<string, any>> => {
  return await fetch(`${BASE_URL}/deployments/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      k8s_token: k8sToken,
    },
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => err);
};
