/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DeploymentResponseData,
  ResponseData,
  MetricsResponseData,
  DeploymentData,
} from './ifaces'

export const postDeploy = async (
  deployUrl: string,
  username: string,
  gitRepoUrl: string,
  repository_name: string,
  k8s_url: string,
  branch: string,
  replicas: number,
  container_port: number,
  k8sToken: string,
  gitLabToken: string
): Promise<ResponseData | DeploymentData> => {
  return await fetch(
    `${deployUrl}/deployments?repository_name=${repository_name}&username=${username}&repository_url=${gitRepoUrl}&branch=${branch}&container_port=${container_port}&k8s_url=${k8s_url}&replicas=${replicas}`,
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
    .catch((err: any): any => err)
}
export const getDeploymentStatus = async (
  deployUrl: string,
  id: string,
  k8sToken: string
): Promise<ResponseData | DeploymentData> => {
  return await fetch(`${deployUrl}/deployments/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'k8s-token': k8sToken,
    },
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => err)
}
export const getDeploymentMetrics = async (
  deployUrl: string,
  id: string,
  k8sToken: string
): Promise<MetricsResponseData> => {
  return await fetch(`${deployUrl}/metrics/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'k8s-token': k8sToken,
    },
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => err)
}

export const getDeploymentList = async (
  deployUrl: string,
  username: string,
  repository_name: string,
  limit: string,
  skip: string
): Promise<DeploymentResponseData> => {
  return await fetch(
    `${deployUrl}/deployments/?user=${username}&project=${repository_name}&skip=${skip}&limit=${limit}`,
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
          return res
        }
        const data = res?.data ? res?.data : []
        const total = res?.count
          ? res?.count
          : res?.data
          ? res?.data?.length
          : 0
        return {
          data,
          total,
        }
      })
    )
    .catch((err: any): any => err)
}
export const deleteDeployment = async (
  deployUrl: string,
  id: string,
  k8sToken: string
): Promise<ResponseData> => {
  return await fetch(`${deployUrl}/deployments/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'k8s-token': k8sToken,
    },
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => err)
}
