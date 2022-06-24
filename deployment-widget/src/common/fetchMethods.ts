/*******************************************************************************
 * Copyright (C) 2021-2022 Wellness TechGroup
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 * 
 * Contributors:
 *   onelifedesigning - initial API and implementation
 ******************************************************************************/
import {
  DeploymentResponseData,
  ResponseData,
  MetricsResponseData,
  DeploymentData,
} from './ifaces';

export const postDeploy = async (
  deployUrl: string,
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
    `${deployUrl}/deployments?project_name=${project}&user=${user}&git_repo_url=${gitRepoUrl}&hostname=${hostname}&branch=${branch}&deployment_port=${deploymentPort}&k8s_url=${k8sUrl}&replicas=${replicas}`,
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
    .catch((err: any): any => err);
};
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
    .catch((err: any): any => err);
};

export const getDeploymentList = async (
  deployUrl: string,
  user: string,
  project: string,
  limit: string,
  skip: string
): Promise<DeploymentResponseData> => {
  return await fetch(
    `${deployUrl}/deployments/?user=${user}&project=${project}&skip=${skip}&limit=${limit}`,
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
    .catch((err: any): any => err);
};
