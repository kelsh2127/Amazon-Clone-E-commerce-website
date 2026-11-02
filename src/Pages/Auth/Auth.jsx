import React, { useState, useContext } from 'react'
import classes from './Signup.module.css'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from "../../Utility/firbase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { DataContext } from "../../components/Dataprovider/Dataprovider"
import { Type } from '../../Utility/action.type';
import { ClipLoader } from "react-spinners";

export default function Auth() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const [loading, setloading] = useState({
    SignIn: false,
    SignUp: false
  });
  
  // FIXED: Correctly using useContext
  const { state, dispatch } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state (for protected routes)
  const redirectPath = location.state?.redirect || "/";
  const message = location.state?.msg;
  
  // Show message if exists (from protected route) - display as text, not popup
  React.useEffect(() => {
    // Don't show alert popup, just let the message be displayed in the UI
  }, [message]);
  
  // Handle Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    
    setloading({ ...loading, SignIn: true });
    seterror("");
    
    try {
      const userInfo = await signInWithEmailAndPassword(auth, email, password);
      dispatch({
        type: Type.SET_USER,
        user: userInfo.user
      });
      setloading({ ...loading, SignIn: false });
      
      // Redirect to the original page or home
      navigate(redirectPath);
    } catch (err) {
      console.error(err);
      seterror(err.message);
      setloading({ ...loading, SignIn: false });
    }
  };
  
  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    setloading({ ...loading, SignUp: true });
    seterror("");
    
    try {
      const userInfo = await createUserWithEmailAndPassword(auth, email, password);
      dispatch({
        type: Type.SET_USER,
        user: userInfo.user
      });
      setloading({ ...loading, SignUp: false });
      
      // Redirect to the original page or home
      navigate(redirectPath);
    } catch (err) {
      console.error(err);
      seterror(err.message);
      setloading({ ...loading, SignUp: false });
    }
  };

  return (
    <section className={classes.login}>
      {/* logo */}
      <Link to="/">
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc_tW-DgZ2rcnz6zho3mIb2mdpAd9xNrIVNQ&s" 
          alt="Amazon Logo" 
        />
      </Link>

      {/* form */}
      <div className={classes.login_container}>
        <h1>Sign In</h1>
        
        <form onSubmit={handleSignIn}>
          <div>
            <label htmlFor="email">Email</label>
            <input 
              value={email} 
              onChange={(e) => setemail(e.target.value)} 
              type="email" 
              id="email" 
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input  
              value={password} 
              onChange={(e) => setpassword(e.target.value)} 
              type="password" 
              id="password" 
              required 
            />
          </div>
          <button 
            className={classes.login_signInButton} 
            type="submit"
            disabled={loading.SignIn}
          >
            {loading.SignIn ? <ClipLoader color="#fff" size={20} /> : "Sign In"}
          </button>
        </form>
        
        {/* Display error message if any */}
        {error && <p className={classes.error}>{error}</p>}
        
        {/* Display redirect message if any */}
        {message && <p className={classes.message}>{message}</p>}
        
        {/* agree to condition */}
        <p>
          By signing in you agree to the AMAZON CLONE condition of use 
          and sale. Please see our privacy notice, our cookies notice 
          and our interest-based ads notice.
        </p>
        
        <button   
          onClick={handleSignUp}  
          className={classes.login_registerButton}
          disabled={loading.SignUp}
        >
          {loading.SignUp ? <ClipLoader color="#000" size={20} /> : "Create your Amazon Account"}
        </button>
         {error&& <small style={{ paddingTop: '5px', color: 'red' }}>{error}</small>}
      </div>
    </section>
  )
}



