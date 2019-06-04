import React from 'react'
import Pikachu from './pikachu.gif'

export default () => {
  return (
    <div>
      <img
        src={Pikachu}
        style={{ width: '200px', margin: 'auto', display: 'block' }}
        alt="Loading..."
      />
    </div>
  );
};
