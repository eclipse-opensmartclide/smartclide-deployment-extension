export interface Settings {
  user: string;
  k8sUrl: string;
  k8sToken: string;
  project: string;
  gitLabToken: string;
  branch: string;
  replicas: string;
}

export interface PaginationState {
  skip: number;
  limit: number;
  total: number;
}

export interface deploymentResponseData {
  data: deploymentData[];
  total: number;
}
export interface deploymentData {
  _id: string;
  user?: string;
  project?: string;
  domain?: string;
  port?: number;
  replicas?: number;
  k8s_url?: string;
  status?: string;
  timestamp?: string;
}