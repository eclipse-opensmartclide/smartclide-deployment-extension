const SERVICE_URL = 'http://localhost:3000';

import {
  DeploymentResponseData,
  ResponseData,
  MetricsResponseData,
  DeploymentData,
} from './ifaces';

export const postDeploy = async (
  user: string,
  gitRepoUrl: string,
  project: string,
  k8sUrl: string,
  hostname: string,
  branch: string,
  replicas: number,
  deploymentPort: number,
  k8sToken: string,
  gitLabToken: string
): Promise<ResponseData | DeploymentData> => {
  return await fetch(
    `${SERVICE_URL}/deployments?project_name=${project}&user=${user}&git_repo_url=${gitRepoUrl}&hostname=${hostname}&branch=${branch}&deployment_port=${deploymentPort}&k8s_url=${k8sUrl}&replicas=${replicas}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'gitlab-token': gitLabToken,
        'k8s-token': k8sToken,
      },
    }
  )
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => err);
};
export const getDeploymentStatus = async (
  id: string,
  k8sToken: string
): Promise<ResponseData | DeploymentData> => {
  return await fetch(`${SERVICE_URL}/deployments/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'k8s-token': k8sToken,
    },
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => err);
};
export const getDeploymentMetrics = async (
  id: string,
  k8sToken: string
): Promise<MetricsResponseData> => {
  return await fetch(`${SERVICE_URL}/metrics/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'k8s-token': k8sToken,
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
): Promise<DeploymentResponseData> => {
  return await fetch(
    `${SERVICE_URL}/deployments/?user=${user}&project=${project}&skip=${skip}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((res: any): any =>
      res.json().then((res: any): any => {
        if (res?.message) {
          return res;
        }
        const data = res?.data ? res?.data : [];
        const total = res?.count
          ? res?.count
          : res?.data
          ? res?.data?.length
          : 0;
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
): Promise<ResponseData> => {
  return await fetch(`${SERVICE_URL}/deployments/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'k8s-token': k8sToken,
    },
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => err);
};
