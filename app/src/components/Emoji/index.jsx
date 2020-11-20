import React from 'react';

const Emoji = (props) => {
  const { label, symbol } = props;
  return (
    <span
      className="emoji"
      role="img"
      aria-label={label || ''}
      aria-hidden={label ? 'false' : 'true'}
    >
      {symbol}
    </span>
  );
};
export default Emoji;
