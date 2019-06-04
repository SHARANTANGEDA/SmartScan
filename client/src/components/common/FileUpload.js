import React from 'react'
import fileUpload from './fileUpload.gif'

export default () => {
  return (
    <div>
      <img
        src={fileUpload}
        style={{ width: '200px', margin: 'auto', display: 'block' }}
        alt="Loading..."
      />
    </div>
  );
};
