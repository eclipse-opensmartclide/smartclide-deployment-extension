import React from 'react';
import Button from '../../Button';

export interface TableProps {
  columnsSource: string[];
  dataSource?: any[];
  actionEdit?: (i: string) => void;
  actionDelete?: (i: string) => void;
}

const TableWidthAction: React.FC<TableProps> = (props) => {
  const { columnsSource, dataSource, actionEdit, actionDelete } = props;
  return (
    <div className="table">
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
                    {actionEdit && data.status === 'active' && (
                      <Button
                        className="btn-primary small mr-xs"
                        onClick={() => actionEdit(data._id)}
                      >
                        Metrics
                      </Button>
                    )}
                    {actionDelete && (
                      <Button
                        className="btn-danger small"
                        onClick={() => actionDelete(data._id)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columnsSource.length !== 0 ? columnsSource.length : 1}
              >
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableWidthAction;
