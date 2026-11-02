import { useEffect, useState, useContext } from 'react'
import AppRouter from './Router.jsx'
import { Type } from './Utility/action.type.js';
import { auth } from './Utility/firbase.js';
import { DataContext } from './components/Dataprovider/Dataprovider.jsx';

function App() {
  const { state, dispatch } = useContext(DataContext);
  const user = state;

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch({
          type: Type.SET_USER,
          user: authUser
        });
      } else {
        dispatch({
          type: Type.SET_USER,
          user: null
        });
      }
    });
  }, []);

  return (
    <>
      <AppRouter />
    </>
  )
}

export default App