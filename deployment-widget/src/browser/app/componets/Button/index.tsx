import React from 'react';

interface ButtonProps {
  className: string;
  onClick: () => void;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = (props) => {
  const { className, onClick, children } = props;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
