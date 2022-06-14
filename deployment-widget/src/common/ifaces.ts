export interface Settings {
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
export interface MetricsResponseData {
  name: string;
  usage: UsageMetrics;
}
export interface DeploymentResponseData {
  data: DeploymentData[];
  total: number;
}
export interface DeploymentData {
  _id: string;
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
