import React, { useState, useEffect } from 'react';

import { useBackendContext } from '../contexts/BackendContext';
import { getDeploymentList } from '../../../common/fetchMethods';

import Spinner from '../componets/Spinner';
import TableWidhtAction from '../componets/Table/TableWidhtAction';
import { Settings, Pagination, deploymentData } from '../../../common/ifaces';

interface DeploymentProps {}

const initialPagination: Pagination = {
  skip: '0',
  limit: '25',
};

const Deployment: React.FC<DeploymentProps> = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [deploymentsSource, setDeploymentsSource] = useState<deploymentData[]>(
    []
  );
  const [columnsSource, setColumnsSource] = useState<string[]>([]);
  const [pagination] = useState<Pagination>(initialPagination);
  const { backend } = useBackendContext();
  const { workspaceService, backendService } = backend;

  useEffect(() => {
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
      //TODO: If dont have settings show conosole msg and return
      const { gitLabToken, project } = prevSettings;
      const deploymentFetchData =
        gitLabToken &&
        project &&
        (await getDeploymentList(pagination.limit, pagination.skip));
      deploymentFetchData && setDeploymentsSource(deploymentFetchData);
    })();
    return () => {
      setLoading(true);
      setDeploymentsSource([]);
    };
  }, []);

  useEffect(() => {
    deploymentsSource.length !== 0 &&
      setColumnsSource([
        'project',
        'user',
        'domain',
        'port',
        'replicas',
        'status',
        'created',
        'actions',
      ]);
  }, [deploymentsSource]);

  useEffect(() => {
    columnsSource.length !== 0 && setLoading(false);
  }, [columnsSource]);

  const handleGetStatus = (id: string) => {
    console.log('id', id);
  };

  return !loading ? (
    <div>
      <h1>Deployments</h1>
      <TableWidhtAction
        columnsSource={columnsSource}
        dataSource={deploymentsSource}
        action={handleGetStatus}
      />
    </div>
  ) : (
    <Spinner isVisible={loading} />
  );
};

export default Deployment;
