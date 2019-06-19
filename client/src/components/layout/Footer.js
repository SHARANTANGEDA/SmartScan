import React from 'react'

export default () => {
  return (
    <footer className=" text-white mt-5 p-4 text-center " style={{background: 'black', height:'60px'
      ,position:'absolute',
      left:0,
      bottom:0,
      right:0}}>
      Copyright &copy; {new Date().getFullYear()} L V Prasad Eye Institute
    </footer>
  );
};
