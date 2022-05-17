import React, { useState, useEffect } from 'react';

import { useBackendContext } from '../contexts/BackendContext';
import { getDeploymentList } from '../../../common/fetchMethods';

import Spinner from '../componets/Spinner';
import TableWidhtAction from '../componets/Table/TableWidhtAction';

interface DeploymentProps {}
interface Settings {
  k8sUrl: string;
  k8sToken: string;
  project: string;
  gitLabToken: string;
  branch: string;
  replicas: string;
}
interface Pagination {
  skip: string;
  limit: string;
}

const initialPagination: Pagination = {
  skip: '0',
  limit: '25',
};

const Deployment: React.FC<DeploymentProps> = () => {
  const [loading, setLoading] = useState<boolean>(true);
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
      //TODO: If dont have settnigs show conosole msg and return
      const { gitLabToken, project } = prevSettings;
      const builds =
        gitLabToken &&
        project &&
        (await getDeploymentList(
          project,
          gitLabToken,
          pagination.limit,
          pagination.skip
        ));
      console.log('builds', builds);
      builds && setLoading(false);
    })();
  }, []);

  const handleGetStatus = (id: string) => {};

  return !loading ? (
    <div>
      <h1>Deployments</h1>
      <TableWidhtAction columns={[]} dataSource={[]} action={handleGetStatus} />
    </div>
  ) : (
    <Spinner isVisible={loading} />
  );
};

export default Deployment;
