import React from 'react';

interface SpinnerProps {
  isVisible?: boolean;
}

const Spinner: React.FC<SpinnerProps> = (props) => {
  const { isVisible } = props;
  return <div id="Spinner" className={`${isVisible ? 'd-show' : 'd-hide'}`} />;
};

export default Spinner;
