import React, { useEffect, useState } from 'react';

import { Row, Col, Table, Pagination, Spinner } from 'react-bootstrap';

// import { useBackendContext } from '../../contexts/BackendContext';

// import { getBuildList } from '../../../../common/fetchMethods';
import { randomBuilds } from '../../../../common/mocks';
interface Build {
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
  const [buildList, setBuildList] = useState<Build[] | null[]>([null]);
  useEffect(() => {
    (async () => {
      // MOCK
      setBuildList(() => randomBuilds());
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
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>State</th>
                  <th>User</th>
                  <th>Repository</th>
                  <th>Branch</th>
                  <th>Created</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {buildList?.map((build, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{build?.id}</td>
                      <td>{build?.state}</td>
                      <td>{build?.username}</td>
                      <td>{build?.repository}</td>
                      <td>{build?.branch}</td>
                      <td>{build?.created}</td>
                      <td>{build?.updated}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Pagination size="sm" className="Pagination-page-link--dark">
              <Pagination.First disabled />
              <Pagination.Prev disabled />
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Item>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>

              <Pagination.Ellipsis />
              <Pagination.Item>{6}</Pagination.Item>
              <Pagination.Next />
              <Pagination.Last />
            </Pagination>
          </>
        ) : (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
      </Col>
    </Row>
  );
};

export default Builds;
