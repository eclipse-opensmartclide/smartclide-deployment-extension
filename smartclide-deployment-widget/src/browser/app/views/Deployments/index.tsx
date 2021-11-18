import React from 'react';
import { Row, Col, Table, Pagination } from 'react-bootstrap';

// import { fetchBuild, fetchBuildStatus } from '../../../common/fetchMethods';

interface DeploymentsProps {}
const Deployments: React.FC<DeploymentsProps> = () => {
  return (
    <Row>
      <Col md={12}>
        <h4 className="text-white">Deployments List</h4>
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

export default Deployments;
