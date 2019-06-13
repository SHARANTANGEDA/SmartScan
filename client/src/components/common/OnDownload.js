import React from 'react'
import Compress from './compress.gif'

export default () => {
  return (
    <div>
      <img
        src={Compress}
        style={{ width: '200px', margin: 'auto', display: 'block' }}
        alt="Loading..."
      />
    </div>
  );
};
