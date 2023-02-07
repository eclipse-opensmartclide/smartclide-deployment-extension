import { DeploymentResponseData, ResponseData, MetricsResponseData, DeploymentData } from './ifaces';
export declare const postDeploy: (deployUrl: string, username: string, gitRepoUrl: string, repository_name: string, k8s_url: string, branch: string, replicas: number, container_port: number, k8sToken: string, gitLabToken: string) => Promise<ResponseData | DeploymentData>;
export declare const getDeploymentStatus: (deployUrl: string, id: string, k8sToken: string) => Promise<ResponseData | DeploymentData>;
export declare const getDeploymentMetrics: (deployUrl: string, id: string, k8sToken: string) => Promise<MetricsResponseData>;
export declare const getDeploymentList: (deployUrl: string, username: string, repository_name: string, limit: string, skip: string) => Promise<DeploymentResponseData>;
export declare const deleteDeployment: (deployUrl: string, id: string, k8sToken: string) => Promise<ResponseData>;
//# sourceMappingURL=fetchMethods.d.ts.map