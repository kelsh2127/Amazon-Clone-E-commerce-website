// productrout.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { DataContext } from '../Dataprovider/Dataprovider';

export default function Productrout({ children, msg, redirect }) {
  const location = useLocation();
  const { state } = useContext(DataContext);
  const user = state?.user || state?.currentUser || null;

  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{
          msg: msg || 'You must log in to continue',
          redirect: redirect || location.pathname,
        }}
      />
    );
  }

  return children;
}