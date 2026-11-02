// src/components/Loader/Loader.jsx
import React from 'react';
import { FadeLoader } from 'react-spinners';

const Loader = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      width: '100%'
    }}>
      <FadeLoader color="#36d7b7" />
    </div>
  );
};

export default Loader;