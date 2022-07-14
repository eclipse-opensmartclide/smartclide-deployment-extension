export interface Settings {
  deployUrl: string;
  username: string;
  repository_url: string;
  repository_name: string;
  k8s_url: string;
  branch: string;
  replicas: number;
  container_port: number;
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
