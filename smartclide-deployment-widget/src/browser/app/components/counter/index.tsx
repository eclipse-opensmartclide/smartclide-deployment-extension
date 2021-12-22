import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';

interface CounterProps {
  endCount: string;
}
const Counter: React.FC<CounterProps> = (props) => {
  const { endCount } = props;
  const [count, setCount] = useState<string>('0');
  useEffect(() => {
    let start = 0;
    let timer: any;

    const end = parseInt(endCount.substring(0, 3));

    if (start === end) return;

    let totalMilSecDur = parseInt('2');
    let incrementTime = (totalMilSecDur / end) * 500;

    timer = setInterval(() => {
      start += 1;
      setCount(String(start) + endCount.substring(3));
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => {
      clearInterval(timer);
      timer = null;
    };
  }, [endCount]);

  return endCount !== '' ? (
    <h2>{count}</h2>
  ) : (
    <Spinner animation="border" variant="light" />
  );
};

export default Counter;
