export interface Settings {
  k8sUrl: string;
  k8sToken: string;
  project: string;
  gitLabToken: string;
  branch: string;
  replicas: string;
}

export interface Pagination {
  skip: string;
  limit: string;
}

export interface SourceData {
  id: string;
  user: string;
  project: string;
  domain: string;
  port: number;
  replicas: number;
  status: string;
  timestamp: string;
}
