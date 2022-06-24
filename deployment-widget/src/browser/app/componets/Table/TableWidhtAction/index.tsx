/*******************************************************************************
 * Copyright (C) 2021-2022 Wellness TechGroup
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 * 
 * Contributors:
 *   onelifedesigning - initial API and implementation
 ******************************************************************************/
import React from 'react';
import Button from '../../Button';

export interface TableProps {
  columnsSource: string[];
  dataSource?: any[];
  actionEdit?: (i: string) => void;
  actionStop?: (i: string) => void;
}

const TableWidthAction: React.FC<TableProps> = (props) => {
  const { columnsSource, dataSource, actionEdit, actionStop } = props;
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
                  <td>{data.domain}</td>
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
                            onClick={() => actionEdit(data.id)}
                          >
                            Metrics
                          </Button>
                        )}
                        {actionStop && (
                          <Button
                            className="btn-danger small"
                            onClick={() => actionStop(data.id)}
                          >
                            Stop
                          </Button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
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
  );
};

export default TableWidthAction;
