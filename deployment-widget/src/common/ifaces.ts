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
export interface Settings {
  deployUrl: string;
  user: string;
  gitRepoUrl: string;
  project: string;
  k8sUrl: string;
  hostname: string;
  branch: string;
  replicas: number;
  deploymentPort: number;
  k8sToken: string;
  gitLabToken: string;
  lastDeploy?: string;
}

export interface PaginationState {
  skip: number;
  limit: number;
  total: number;
}
export interface ResponseData {
  message: string;
}
export interface UsageMetrics {
  cpu: string;
  memory: string;
}
export interface CostMetrics {
  cost: number;
  cost_type: string;
  name: string;
  current: boolean;
}
export interface MetricsResponseData {
  usage: UsageMetrics;
  cost?: CostMetrics[];
}
export interface DeploymentResponseData {
  data?: DeploymentData[];
  total?: number;
  message?: string;
}
export interface DeploymentData {
  id: string;
  user?: string;
  project?: string;
  domain?: string;
  port?: number;
  replicas?: number;
  k8s_url?: string;
  status?: string;
  created_at?: string;
  stopped_at?: string;
}
