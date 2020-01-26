import React from 'react';
interface ExpandButtonProps {
  type: 'plus' | 'minus';
  width?: number;
}

const ExpandButton: React.FC<ExpandButtonProps> = props => {
  const { type, width = 12 } = props;
  return <svg style={{ cursor: 'pointer', display: 'inline' }} strokeWidth="1" fill="none" viewBox="0 0 12 12" stroke="currentColor" width={width}>
    <circle cx="6" cy="6" r="5"></circle>
    <line x1="4" y1="6" x2="8" y2="6"></line>
    { type === 'plus' && <line x1="6" y1="4" x2="6" y2="8"></line> }
  </svg>
}

export default ExpandButton;
