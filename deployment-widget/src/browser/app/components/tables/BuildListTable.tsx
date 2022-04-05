import React from 'react';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Build } from '../../views/Builds';
const columns = [
  {
    dataField: 'id',
    text: 'Id',
    sort: true,
  },
  {
    dataField: 'state',
    text: 'State',
    sort: true,
  },
  {
    dataField: 'username',
    text: 'User',
    sort: true,
  },
  {
    dataField: 'repository',
    text: 'Repository',
    sort: true,
  },
  {
    dataField: 'branch',
    text: 'Branch',
    sort: true,
  },
  {
    dataField: 'created',
    text: 'Created',
    sort: true,
  },
  {
    dataField: 'updated',
    text: 'Updated',
    sort: true,
  },
];

interface BuildListTableProps {
  builds: Build[] | null[];
}

const BuildListTable: React.FC<BuildListTableProps> = (props) => {
  const { builds } = props;

  const paginationOption = {
    totalSize: builds.length,
    sizePerPage: 10,
    paginationSize: 10,
  };
  return (
    builds && (
      <BootstrapTable
        classes="table-dark"
        bootstrap4
        striped
        hover
        keyField="id"
        data={builds}
        columns={columns}
        noDataIndication="No data"
        pagination={paginationFactory(paginationOption)}
      />
    )
  );
};

export default BuildListTable;
