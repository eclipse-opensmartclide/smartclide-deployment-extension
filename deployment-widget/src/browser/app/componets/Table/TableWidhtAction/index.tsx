import React from 'react';
import Button from '../../Button';

export interface TableProps {
  columns: [];
  dataSource: any[];
  action: (i: string) => void;
}

const TableWidthAction: React.FC<TableProps> = (props) => {
  const { columns, dataSource, action } = props;
  return (
    <table>
      <thead>
        {columns.length !== 0 && (
          <tr>
            {columns.map((col) => (
              <th>{col}</th>
            ))}
          </tr>
        )}
      </thead>
      <tbody>
        {dataSource.length !== 0 ? (
          dataSource.map((data, index) => {
            return (
              <tr key={index}>
                <td>{data.id}</td>
                <td>{data.created}</td>
                <td>{data.updated}</td>
                <td>{data.state}</td>
                <td>{data.repository}</td>
                <td>{data.username}</td>
                <td>{data.branch}</td>
                <td>
                  <Button
                    className="btn-primary"
                    onClick={() => action(data.id)}
                  >
                    Deploy
                  </Button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={columns.length !== 0 ? columns.length : 1}>No data</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableWidthAction;
