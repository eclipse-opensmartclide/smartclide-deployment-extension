import React from 'react';
import Monitoring from './Monitoring';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Monitoring />
    </div>
  );
};

export default Dashboard;
