import React, { useEffect, useState } from 'react';

import { Row, Col, Spinner } from 'react-bootstrap';
import BuildListTable from '../../components/tables/BuildListTable';
// import { useBackendContext } from '../../contexts/BackendContext';
// import { getBuildList } from '../../../../common/fetchMethods';

import { randomBuilds } from '../../../../common/mocks';
export interface Build {
  id: number;
  state: string;
  username: string;
  repository: string;
  branch: string;
  created: string;
  updated: string;
}

interface BuildsProps {}
const Builds: React.FC<BuildsProps> = () => {
  // const { backend } = useBackendContext();
  // const { workspaceService, backendService } = backend;
  const [buildList, setBuildList] = useState<Build[] | null>();
  useEffect(() => {
    (async () => {
      // MOCK
      setTimeout(() => {
        setBuildList(() => randomBuilds());
      }, 2000);
      // const currentPath =
      //   workspaceService.workspace?.resource.path.toString() || '';

      // const prevSettings =
      //   currentPath &&
      //   JSON.parse(
      //     await backendService.fileRead(`${currentPath}/.settings.json`)
      //   );

      // const { token, project } = prevSettings;

      // const builds = token && project && (await getBuildList(project, token));
    })();
  }, []);

  return (
    <Row>
      <Col md={12}>
        <h4 className="text-white">Build List</h4>
        {buildList ? (
          <>
            <BuildListTable builds={buildList} />
          </>
        ) : (
          <div className="text-right">
            <Spinner animation="border" variant="light" />
          </div>
        )}
      </Col>
    </Row>
  );
};

export default Builds;
