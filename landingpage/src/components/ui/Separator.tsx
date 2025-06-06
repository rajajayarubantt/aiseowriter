import React from 'react';

interface ButtonProps {
  className?: string;
  orientation?: string;
}

const Separator: React.FC<ButtonProps> =({
    className = '',
    orientation = 'horizontal'
}) => {
 
  return (
    <div className={`${orientation == 'horizontal' ? 'h-[1px] w-full': 'h-full w-[1px]'} bg-border ${className}`}></div>
  );
};

export default Separator;