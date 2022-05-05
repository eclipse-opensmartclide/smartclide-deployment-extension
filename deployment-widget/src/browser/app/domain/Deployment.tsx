import React from 'react';

interface DeploymentProps {}

const Deployment: React.FC<DeploymentProps> = () => {
  return (
    <div>
      <h1>Deployments</h1>
      <table>
        <th>
          <td>Id</td>
        </th>
        <tr>
          <td>1</td>
        </tr>
      </table>
    </div>
  );
};

export default Deployment;
