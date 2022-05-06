import React, { useState, useEffect } from 'react';

import Spinner from '../componets/Spinner';
import Button from '../componets/Button';

interface DeploymentProps {}

const Deployment: React.FC<DeploymentProps> = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timmer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => {
      clearTimeout(timmer);
    };
  }, []);

  return !loading ? (
    <div>
      <h1>Deployments</h1>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>{new Date()}</td>
            <td>stoped</td>
            <td>
              <Button className="btn-danger">Delete</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <Spinner isVisible={loading} />
  );
};

export default Deployment;
