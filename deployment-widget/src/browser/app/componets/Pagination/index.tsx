import React, { useState, useEffect } from 'react';
import Button from '../Button';

import { PaginationState } from '../../../../common/ifaces';

interface PaginationProps {
  skip: number;
  total: number;
  limit: number;
  setState: React.Dispatch<React.SetStateAction<PaginationState>>;
}

const Pagination: React.FC<PaginationProps> = ({
  skip,
  total,
  limit,
  setState,
}) => {
  const [currentLimit, setCurrentLimit] = useState<number>(0);
  const [currentSkip, setCurrentSkip] = useState<number>(0);
  const [currentTotal, setCurrentTotal] = useState<number>(0);

  useEffect(() => {
    setCurrentLimit(limit);
    setCurrentSkip(skip);
    setCurrentTotal(total);
  }, [skip, total, limit]);

  const handlePrev = () => {
    setState(
      (prev: PaginationState): PaginationState => ({
        ...prev,
        skip: prev.skip - prev.limit,
      })
    );
  };
  const handleNext = () => {
    setState(
      (prev: PaginationState): PaginationState => ({
        ...prev,
        skip: prev.limit + prev.skip,
      })
    );
  };
  return (
    <div className="d-flex space-bettwen center pagination p-xs">
      <div className="d-flex space-bettwen center">
        <Button
          className="btn small"
          onClick={() => handlePrev()}
          disabled={currentSkip <= 0 || currentLimit >= currentTotal}
        >
          {'<'}
        </Button>
        <Button
          className="btn small"
          onClick={() => handleNext()}
          disabled={
            currentSkip >= currentTotal - currentLimit ||
            currentLimit + currentSkip >= currentTotal
          }
        >
          {'>'}
        </Button>
        <p style={{ paddingLeft: '10px' }}>Total: {currentTotal}</p>
      </div>
      {currentLimit > 25 && (
        <div className="d-flex space-bettwen center">
          <p style={{ paddingRight: '10px' }}>Limit: </p>
          <select
            className="select"
            defaultValue={currentLimit}
            onChange={(e) => {
              e.target.value &&
                setState(
                  (prev: PaginationState): PaginationState => ({
                    ...prev,
                    limit: parseInt(e.target.value),
                  })
                );
            }}
          >
            <option value="25">25</option>
            {currentLimit > 50 && <option value="50">50</option>}
            {currentLimit > 100 && <option value="100">100</option>}
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;
