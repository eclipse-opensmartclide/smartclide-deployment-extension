import React from 'react';
import Button from '../../Button';

export interface TableProps {
  columnsSource: string[];
  dataSource?: any[];
  action?: (i: string) => void;
}

const TableWidthAction: React.FC<TableProps> = (props) => {
  const { columnsSource, dataSource, action } = props;
  return (
    <table className="deployment-table">
      <thead>
        {columnsSource.length !== 0 && (
          <tr>
            {columnsSource.map((col, key) => (
              <th key={key}>{col}</th>
            ))}
          </tr>
        )}
      </thead>
      <tbody>
        {dataSource && dataSource.length !== 0 ? (
          dataSource.map((data, index) => {
            return (
              <tr key={index}>
                <td>{data.project}</td>
                <td>{data.user}</td>
                <td>{data.domain}</td>
                <td>{data.port}</td>
                <td>{data.replicas}</td>
                <td>{data.status}</td>
                <td>{new Date(data.timestamp).toLocaleDateString()}</td>
                <td>
                  <Button
                    className="btn-primary"
                    onClick={() => action && action(data._id)}
                  >
                    Deploy
                  </Button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={columnsSource.length !== 0 ? columnsSource.length : 1}>
              No data
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableWidthAction;
