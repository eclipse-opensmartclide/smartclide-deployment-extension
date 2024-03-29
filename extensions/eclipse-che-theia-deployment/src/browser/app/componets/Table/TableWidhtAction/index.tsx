/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Button from '../../Button'

export interface TableProps {
  columnsSource: string[]
  dataSource?: any[]
  loading?: boolean
  actionEdit?: (i: string) => void
  actionStop?: (i: string) => void
}

const TableWidthAction: React.FC<TableProps> = (props) => {
  const { columnsSource, dataSource, actionEdit, actionStop, loading } = props
  return (
    <div className="table">
      <table className="deployment-table">
        <thead>
          {columnsSource && columnsSource?.length !== 0 && (
            <tr>
              {columnsSource.map((col, key) => (
                <th key={key}>{col}</th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {dataSource && dataSource?.length > 0 ? (
            dataSource?.map((data, index) => {
              return (
                <tr key={index}>
                  <td>{data.k8s_url}</td>
                  <td>{data.port}</td>
                  <td>{data.replicas}</td>
                  <td>{data.status}</td>
                  <td>{new Date(data.created_at).toLocaleDateString()}</td>
                  <td>
                    {data.status === 'active' && (
                      <>
                        {actionEdit && (
                          <Button
                            className="btn-primary small mr-xs"
                            disabled={loading}
                            onClick={() => actionEdit(data.id)}
                          >
                            Metrics
                          </Button>
                        )}
                        {actionStop && (
                          <Button
                            className="btn-danger small"
                            disabled={loading}
                            onClick={() => actionStop(data.id)}
                          >
                            Stop
                          </Button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td
                colSpan={
                  columnsSource?.length !== 0 ? columnsSource?.length : 1
                }
              >
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TableWidthAction
