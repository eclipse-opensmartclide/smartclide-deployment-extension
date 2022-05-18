import React, { useState, useEffect } from 'react';

import { useBackendContext } from '../contexts/BackendContext';
import {
  deleteDeployment,
  getDeploymentList,
} from '../../../common/fetchMethods';

import Spinner from '../componets/Spinner';
import Pagination from '../componets/Pagination/';
import TableWidhtAction from '../componets/Table/TableWidhtAction';
import {
  Settings,
  PaginationState,
  deploymentData,
} from '../../../common/ifaces';

const initialPagination: PaginationState = {
  skip: 0,
  limit: 25,
  total: 0,
};

const Deployment: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [deploymentsSource, setDeploymentsSource] = useState<deploymentData[]>(
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
    };
  }, []);

  useEffect(() => {
    deploymentsSource &&
      deploymentsSource.length !== 0 &&
      // 'project',
      // 'user',
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
    columnsSource && columnsSource.length !== 0 && setLoading(false);
  }, [columnsSource]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const currentPath =
        workspaceService.workspace?.resource.path.toString() || '';
      const prevSettings: Settings =
        currentPath &&
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
        setDeploymentsSource(deploymentFetchData.data);
        setPagination(
          (prev: PaginationState): PaginationState => ({
            ...prev,
            total: deploymentFetchData.total,
          })
        );
      }
    })();
  }, [pagination.skip, pagination.limit]);

  const handleGetStatus = (id: string) => {
    console.log('handleGetStatus', id);
  };

  const handleDelete = async (id: string) => {
    const deploymentDeleted = await deleteDeployment(id);
    deploymentDeleted &&
      (async () => {
        const currentPath =
          workspaceService.workspace?.resource.path.toString() || '';
        const prevSettings: Settings =
          currentPath &&
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
          setDeploymentsSource(deploymentFetchData.data);
          setPagination(
            (prev: PaginationState): PaginationState => ({
              ...prev,
              total: deploymentFetchData.total,
            })
          );
        }
      })();
  };

  return (
    <div>
      <h1>Deployments</h1>
      {!loading ? (
        <>
          <TableWidhtAction
            columnsSource={columnsSource}
            dataSource={deploymentsSource}
            actionEdit={handleGetStatus}
            actionDelete={handleDelete}
          />
          <Pagination
            limit={pagination.limit}
            skip={pagination.skip}
            total={pagination.total}
            setState={setPagination}
          />
        </>
      ) : (
        <Spinner isVisible={loading} />
      )}
    </div>
  );
};

export default Deployment;
