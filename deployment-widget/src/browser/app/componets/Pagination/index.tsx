import React from 'react';
import Button from '../Button';

interface PaginationProps {}

const Pagination: React.FC<PaginationProps> = () => {
  return (
    <div className="d-flex space-bettwen center">
      <div>
        <Button className="btn small">{'<'}</Button>
        <Button className="btn small">{'>'}</Button>
      </div>
      <select className="select">
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  );
};

export default Pagination;
