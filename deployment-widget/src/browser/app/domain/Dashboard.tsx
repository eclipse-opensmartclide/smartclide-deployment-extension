import React, { useState, useEffect } from 'react';

import { useBackendContext } from '../contexts/BackendContext';
import {
  deleteDeployment,
  getDeploymentList,
  getDeploymentMetrics,
} from '../../../common/fetchMethods';

import Spinner from '../componets/Spinner';
import Pagination from '../componets/Pagination/';
import TableWidhtAction from '../componets/Table/TableWidhtAction';
import {
  Settings,
  PaginationState,
  DeploymentData,
  MetricsResponseData,
} from '../../../common/ifaces';
import Monitoring from './Monitoring';

const initialPagination: PaginationState = {
  skip: 0,
  limit: 25,
  total: 0,
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [settings, setSettings] = useState<Settings>();
  const [message, setMessage] = useState<string>('');
  const [currentDeployment, setCurrentDeployment] = useState<string>('');
  const [metrics, setMetrics] = useState<MetricsResponseData | null>();
  const [deploymentsSource, setDeploymentsSource] = useState<DeploymentData[]>(
    []
  );
  const [columnsSource, setColumnsSource] = useState<string[]>([]);
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination);
  const { backend } = useBackendContext();
  const { workspaceService, backendService } = backend;

  useEffect(() => {
    return () => {
      setLoading(true);
      setDeploymentsSource([]);
      setMetrics(null);
      setCurrentDeployment('');
    };
  }, []);

  useEffect(() => {
    if (backendService !== undefined && workspaceService !== undefined) {
      const currentPath =
        workspaceService.workspace?.resource.path.toString() || '';
      !currentPath &&
        setMessage('It is necessary to have at least one repository open.');
      if (currentPath) {
        backendService
          .fileRead(`${currentPath}/.smartclide-settings.json`)
          .then((backendRead: any) => {
            setSettings(JSON.parse(backendRead));
          });
      }
    }
  }, [backendService, workspaceService]);

  useEffect(() => {
    message.length !== 0 && setLoading(false);
  }, [message]);

  useEffect(() => {
    console.log('metrics', metrics);
  }, [metrics]);

  useEffect(() => {
    setLoading(true);
    if (
      settings !== undefined &&
      pagination.skip !== null &&
      pagination.limit !== null
    ) {
      const { gitLabToken, project, user } = settings;
      if (gitLabToken && project && user) {
        (async () => {
          const deploymentFetchData = await getDeploymentList(
            user,
            project,
            pagination.limit.toString(),
            pagination.skip.toString()
          );
          if (deploymentFetchData) {
            if (deploymentFetchData.message) {
              setMessage(deploymentFetchData.message);
              setDeploymentsSource([]);
              setPagination(
                (prev: PaginationState): PaginationState => ({
                  ...prev,
                  total: 0,
                })
              );
            } else if (deploymentFetchData.data && deploymentFetchData.total) {
              setMessage('');
              setDeploymentsSource(deploymentFetchData.data);
              setPagination(
                (prev: PaginationState): PaginationState => ({
                  ...prev,
                  total: deploymentFetchData.total || 0,
                })
              );
            }
          }
        })();
      }
    }
  }, [pagination.skip, pagination.limit, settings]);

  useEffect(() => {
    deploymentsSource &&
      deploymentsSource?.length !== 0 &&
      setColumnsSource([
        'domain',
        'k8 url',
        'port',
        'replicas',
        'status',
        'created',
        'actions',
      ]);
  }, [deploymentsSource]);

  useEffect(() => {
    columnsSource && columnsSource?.length !== 0 && setLoading(false);
  }, [columnsSource]);

  useEffect(() => {
    let interval: any;
    if (currentDeployment.length !== 0) {
      interval = setInterval(async () => {
        const newMetrics = await getGetMetrics(currentDeployment);
        newMetrics && setMetrics(newMetrics);
      }, 6000);
    }
    return () => {
      setMetrics(null);
      clearInterval(interval);
    };
  }, [currentDeployment]);

  const getGetMetrics = async (
    id: string
  ): Promise<MetricsResponseData | null> => {
    if (!id || settings === undefined) {
      return null;
    } else {
      const { k8sToken } = settings;
      if (!k8sToken) {
        return null;
      }
      const newMetric = await getDeploymentMetrics(id, k8sToken);
      return newMetric;
    }
  };

  const handleGetMetrics = async (id: string) => {
    setCurrentDeployment(id);
  };

  const handleStop = async (id: string) => {
    const currentPath =
      workspaceService.workspace?.resource.path.toString() || '';
    const prevSettings: Settings =
      currentPath &&
      backendService &&
      JSON.parse(
        await backendService.fileRead(
          `${currentPath}/.smartclide-settings.json`
        )
      );
    const { k8sToken } = prevSettings;
    const deploymentDeleted =
      k8sToken && (await deleteDeployment(id, k8sToken));
    if (deploymentDeleted) {
      const currentPath =
        workspaceService.workspace?.resource.path.toString() || '';
      const prevSettings: Settings =
        currentPath &&
        backendService &&
        JSON.parse(
          await backendService.fileRead(
            `${currentPath}/.smartclide-settings.json`
          )
        );
      const { gitLabToken, project, user } = prevSettings;
      const deploymentFetchData =
        gitLabToken &&
        project &&
        (await getDeploymentList(
          user,
          project,
          pagination.limit.toString(),
          pagination.skip.toString()
        ));
      if (deploymentFetchData) {
        if (deploymentFetchData.message) {
          setDeploymentsSource([]);
          setPagination(
            (prev: PaginationState): PaginationState => ({
              ...prev,
              total: 0,
            })
          );
        } else if (deploymentFetchData.data && deploymentFetchData.total) {
          setDeploymentsSource(deploymentFetchData.data);
          setPagination(
            (prev: PaginationState): PaginationState => ({
              ...prev,
              total: deploymentFetchData.total || 0,
            })
          );
        }
      }
    }
  };

  return (
    <div>
      <h1>Deployments</h1>
      {!loading ? (
        message ? (
          <h3 style={{ textAlign: 'center' }}>{message}</h3>
        ) : (
          <>
            <TableWidhtAction
              columnsSource={columnsSource}
              dataSource={deploymentsSource}
              actionEdit={handleGetMetrics}
              actionStop={handleStop}
            />
            <Pagination
              limit={pagination.limit}
              skip={pagination.skip}
              total={pagination.total}
              setState={setPagination}
            />
            {metrics && (
              <Monitoring usage={metrics.usage} cost={metrics.cost} />
            )}
          </>
        )
      ) : (
        <Spinner isVisible={loading} />
      )}
    </div>
  );
};

export default Dashboard;
