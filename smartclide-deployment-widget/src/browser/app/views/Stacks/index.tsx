import React, { useState, useEffect } from 'react';
import {
  Button,
  Row,
  Col,
  Card,
  Form,
  Alert,
  Spinner,
  Table,
  Pagination,
  Toast,
  ToastContainer,
} from 'react-bootstrap';

import { ManageLocalStorage, ProjectProps } from '../../../common/localStorage';
// import { fetchBuild, fetchBuildStatus } from '../../../common/fetchMethods';

interface StacksProps {}
interface AlertProps {
  visible: boolean;
  variant?: string;
  message?: string;
}

// let interval: any;

const Stacks: React.FC<StacksProps> = () => {
  const [localProjectStorage, setLocalProjectStorage] = useState<any>();
  const [storeProjects, setStoreProjects] = useState<ProjectProps[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectProps>({
    project: '',
    token: '',
  });
  const [replacementToken, setReplacementToken] = useState<boolean>(false);

  const [isBuilding, setIsBuildig] = useState<boolean>(false);

  const [alert, setAlert] = useState<AlertProps>({
    visible: false,
    variant: '',
    message: '',
  });
  const [process, setProcess] = useState<boolean>(false);

  useEffect(() => {
    setLocalProjectStorage(new ManageLocalStorage());
  }, []);
  useEffect(() => {
    console.log(currentProject?.project, currentProject?.token);
  }, [currentProject]);

  useEffect(() => {
    const localData = localProjectStorage?.getAllLocalStorage('settings');
    localData && setStoreProjects(localData);
  }, [localProjectStorage]);

  const handleChangeForm = (value: string, target: string) => {
    if (target === 'project') {
      const currentProjectSeleted = storeProjects.filter(
        (project: ProjectProps) => {
          return project.project === value && project;
        }
      )[0];
      if (currentProjectSeleted) {
        setCurrentProject(currentProjectSeleted);
        setReplacementToken(true);
      } else {
        setReplacementToken(false);
      }
    } else {
      setCurrentProject((prev) => {
        return { ...prev, [target]: value };
      });
    }
  };
  const handleSubmitForm = async () => {
    setIsBuildig(true);
    setTimeout(() => {
      setProcess(true);
      setIsBuildig(false);
      setAlert({
        visible: true,
        variant: 'warning',
        message: 'This is a example for mockBuild',
      });
    }, 2000);
    setTimeout(() => {
      setAlert((prev: AlertProps) => ({ ...prev, visible: false }));
    }, 6000);
    if (currentProject.project && currentProject.token) {
      localProjectStorage.setLocalStorage('settings', [
        ...storeProjects.filter((project: ProjectProps) => {
          return project?.project !== currentProject?.project && project;
        }),
        { ...currentProject, build: 'mockBuildName' },
      ]);

      // const res: Record<string, any> = await fetchBuild(
      //   currentProject.project,
      //   currentProject.token
      // );

      // console.log('res', res.state);

      // if (res?.state === 'pending') {
      //   interval = setInterval(async () => {
      //     const resp: Record<string, any> = await fetchBuildStatus(
      //       currentProject.project,
      //       currentProject.token
      //     );
      //     console.log('resp', resp.state);
      //
      //     if (resp?.state === 'success') {
      //       clearInterval(interval);
      //       // this.localStorageService.setData(
      //       //   currentProject,
      //       //   JSON.stringify([
      //       //     ...restLocalData,
      //       //     {
      //       //       project,
      //       //       token,
      //       //       build: resp?.name || 'mockName',
      //       //     },
      //       //   ])
      //       // );
      //        setIsBuildig(false);
      //     }
      //     if (resp?.state === 'error') {
      //       console.log('error fecth', resp);
      //       clearInterval(interval);
      //     }
      //   }, 8000);
      // }
      // if (res?.state === 'error') {
      //    setIsBuildig(false);
      //   console.log('error fecth', res);
      // }
    }
  };
  return (
    <Row>
      {alert?.visible && (
        <Alert
          className="Alert-fixed--top-right text-start"
          onClose={() =>
            setAlert((prev: AlertProps) => ({ ...prev, visible: false }))
          }
          variant={alert?.variant}
          dismissible
        >
          {alert?.message}
        </Alert>
      )}
      <Col md={7}>
        <h4 className="text-white">Stack List</h4>
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
      <Col md={5}>
        <Card bg="dark" text="dark">
          <Card.Body>
            <Card.Title className="text-white">Create new build</Card.Title>
            <Form>
              <Form.Group className="mb-3" controlId="validationProject">
                <Form.Label>Project</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Project name"
                  onChange={(e) => handleChangeForm(e.target.value, 'project')}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid project.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="validationToken">
                <Form.Label>Secret Token</Form.Label>
                <Form.Control
                  type={replacementToken ? 'password' : 'text'}
                  readOnly={replacementToken ? true : false}
                  placeholder="Enter Secret Token"
                  onChange={(e) => handleChangeForm(e.target.value, 'token')}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a token.
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  We'll never share your token with anyone else.
                </Form.Text>
              </Form.Group>
              <div className="text-end">
                <Button
                  variant="success"
                  disabled={isBuilding}
                  onClick={() => handleSubmitForm()}
                >
                  {!isBuilding ? (
                    'Create'
                  ) : (
                    <Spinner animation="border" role="status" size="sm">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12}>
        <div
          aria-live="polite"
          aria-atomic="true"
          className="bg-dark position-relative"
          style={{ minHeight: '240px' }}
        >
          <ToastContainer position="top-start" className="p-3 w-100">
            <Toast bg="dark" onClose={() => setProcess(false)} show={process}>
              <Toast.Header>
                <strong className="me-auto">Building</strong>
                <small>status</small>
              </Toast.Header>
              <Toast.Body className="text-white">
                Woohoo, you're reading this text in a Toast!
              </Toast.Body>
            </Toast>
          </ToastContainer>
        </div>
      </Col>
    </Row>
  );
};

export default Stacks;
