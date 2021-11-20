import React, { useEffect } from 'react';
import { Row, Col, Table, Pagination } from 'react-bootstrap';

import { useBackendContext } from '../../contexts/BackendContext';

// import { fileRead } from '../../../common/fileActions';
// import { getBuildList } from '../../../common/fetchMethods';
// import fetchHookWithLoading from '../../../common/fetchHookWithLoading';

interface BuildsProps {}
const Builds: React.FC<BuildsProps> = () => {
  const { backend } = useBackendContext();
  const { workspaceService, backendService } = backend;
  useEffect(() => {
    (async () => {
      const currentProject: string | undefined =
        workspaceService.workspace?.name?.split('.')[0] || 'mono';

      const currentPath =
        workspaceService.workspace?.resource.path.toString() || '';

      console.log('currentProject', currentProject);
      console.log('currentPath', currentPath);

      const prevSettings =
        currentPath &&
        (await backendService.fileRead(`${currentPath}/.settings.json`));
      console.log('prevSettings', prevSettings);
    })();
  }, []);

  // const { data, loading } = fetchHookWithLoading(getBuildList, props);
  return (
    <Row>
      <Col md={12}>
        <h4 className="text-white">Build List</h4>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Project</th>
              <th>Build</th>
              <th>Update at</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>test-kubernetes</td>
              <td>build-name</td>
              <td>2/5/2021</td>
            </tr>
            <tr>
              <td>test-kubernetes</td>
              <td>build-name</td>
              <td>2/5/2021</td>
            </tr>
            <tr>
              <td>test-kubernetes</td>
              <td>build-name</td>
              <td>2/5/2021</td>
            </tr>
            <tr>
              <td>test-kubernetes</td>
              <td>build-name</td>
              <td>2/5/2021</td>
            </tr>
            <tr>
              <td>test-kubernetes</td>
              <td>build-name</td>
              <td>2/5/2021</td>
            </tr>
            <tr>
              <td>test-kubernetes</td>
              <td>build-name</td>
              <td>2/5/2021</td>
            </tr>
            <tr>
              <td>test-kubernetes</td>
              <td>build-name</td>
              <td>2/5/2021</td>
            </tr>
            <tr>
              <td>test-kubernetes</td>
              <td>build-name</td>
              <td>2/5/2021</td>
            </tr>
            <tr>
              <td>test-kubernetes</td>
              <td>build-name</td>
              <td>2/5/2021</td>
            </tr>
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
      </Col>
    </Row>
  );
};

export default Builds;
