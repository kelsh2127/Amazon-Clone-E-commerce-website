import React, { useContext, useState, useEffect } from 'react';
import classes from './Payment.module.css';
import LayOut from '../../components/LayOut/Layout';
import { DataContext } from '../../components/Dataprovider/Dataprovider';
import ProductCard from '../../components/Product/ProductCard';
import Currencyfromat from '../../components/CurrencyFormat/Currencyfromat';
import { axiosInstance } from '../../APII/axios';
import { useNavigate } from 'react-router-dom';
import {db} from "../../Utility/firbase.js";
// NEW: Import payment service
import { initializePayment, verifyPayment } from '../../Services/Paymentservices';

export default function Payment() {
  const { state } = useContext(DataContext);
  const { user, basket } = state;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const totalItem = basket?.reduce((amount, item) => {
    return item.amount + amount;
  }, 0);
  
  const total = basket?.reduce((amount, item) => {
    return item.price * item.amount + amount;
  }, 0);

  // Check if basket is empty
  useEffect(() => {
    if (!basket || basket.length === 0) {
      navigate('/cart');
    }
  }, [basket, navigate]);




  // CORRECTED: handleChapaPayment with proper txRef format
const handleChapaPayment = async (e) => {
  e.preventDefault();
  
  if (!basket || basket.length === 0) {
    setError('Your cart is empty');
    return;
  }

  // Remove user login requirement for payment
  // if (!user?.email) {
  //   setError('Please sign in to continue');
  //   return;
  // }
  
  setLoading(true);
  setError(null);

  try {
    // ✅ FIXED: Use hyphens, not underscores - matches Chapa's format
    const txRef = `tx-${Date.now()}`;  // ← CHANGED: from underscores to hyphens
    
    // Save to localStorage for verification after redirect
    localStorage.setItem('txRef', txRef);
    
    console.log('Initializing payment with:', {
      amount: total,
      email: user.email,
      txRef: txRef
    });

    // Using the payment service
    const paymentData = {
      amount: total,
      currency: 'ETB',
      email: user?.email || 'guest@example.com', // Use guest email if not logged in
      firstName: user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Guest',
      lastName: user?.displayName?.split(' ').slice(1).join(' ') || 'Customer',
      txRef: txRef,  // ← Now using correct format
    };

    const result = await initializePayment(paymentData);
    console.log('Chapa response:', result);
    
    // Redirect to Chapa checkout page
    if (result.success && result.checkoutUrl) {
      window.location.href = result.checkoutUrl;
    } else {
      throw new Error('No checkout URL received from Chapa');
    }
    
  } catch (error) {
    console.error('Payment error details:', error);
    
    if (error.code === 'ERR_NETWORK') {
      setError('Network error. Please check if your backend server is running.');
    } else {
      setError(error.message || 'Payment failed. Please try again.');
    }
    
    // Clear localStorage on error
    localStorage.removeItem('txRef');
  } finally {
    setLoading(false);
  }
};
  

  // NEW: Check payment status when returning from Chapa (for the success page)
  useEffect(() => {
    const checkReturnedPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const txRef = urlParams.get('tx_ref') || localStorage.getItem('txRef');
      
      if (txRef && window.location.pathname === '/payment-success') {
        try {
          console.log('Verifying payment:', txRef);
          const result = await verifyPayment(txRef);
          
          if (result.success && result.paid) {
            console.log('Payment verified successfully!');
            // Clear basket here if needed
            localStorage.removeItem('txRef');
          }







        } catch (error) {
          console.error('Verification error:', error);
        }
      }
    };
    
    checkReturnedPayment();
  }, []); // NEW: Added dependency array


  
//database conection


// await db.collection("users").doc(user.uid).collection("orders").doc(paymentIntent.id).
// set({
// basket:basket,
// amount:paymentIntent.amount,
// created:paymentIntent.created,
// })




  return (
    <LayOut>
      {/* header */}
      <div className={classes.payment_header}>
        CheckOut ({totalItem} {totalItem === 1 ? 'item' : 'items'})
      </div>
      
      {/* payment section */}
      <section className={classes.payment}>
        {/* address */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div><strong>Email:</strong> {user?.email || 'Not signed in'}</div>
            <div><strong>Address:</strong> 123 Main St, City, State 12345</div>
            <div><strong>City:</strong> Chicago, IL</div>
          </div>
        </div>
        
        <hr />
        
        {/* product review */}
        <div className={classes.flex}>
          <h3>Review items ({totalItem})</h3>
          <div className={classes.products_container}>
            {basket?.map((item, index) => {
              return <ProductCard 
                product={item}
                flex={true}
                key={index} 
              />
            })}
          </div>
        </div>
        
        <hr />
        
        {/* payment methods */}
        <div className={classes.flex}> 
          <h3>Payment Method</h3>
          <div className={classes.payment_card_container}>
            <div className={classes.payment_details}>
              
              {/* Display error message if any */}
              {error && (
                <div className={classes.error_message}>
                  <strong>Error:</strong> {error}
                  <button 
                    onClick={() => setError(null)}
                    className={classes.dismiss_button}
                  >
                    ×
                  </button>
                </div>
              )}
              
              {/* Chapa Payment Button */}
              <form onSubmit={handleChapaPayment}>
                <div className={classes.payment_method_card}>
                  <div className={classes.method_header}>
                    <img 
                      src="https://ethiopianlogos.com/logos/chapa_gradient/chapa_gradient.png" 
                      alt="Chapa" 
                      className={classes.method_logo}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <h4>Pay with Chapa</h4>
                  </div>
                  <p className={classes.method_description}>
                    Secure payment via Chapa - Ethiopia's leading payment gateway
                  </p>
                  
                  <div className={classes.payment_options}>
                    <small>Accepted payment methods:</small>
                    <div className={classes.payment_methods_list}>
                      <span>Telebirr</span>
                      <span>CBE Birr</span>
                      <span>Ebirr</span>
                      <span>Amole</span>
                      <span>M-Pesa</span>
                      <span>Cards</span>
                    </div>
                  </div>
                  
                  <div className={classes.payment_price}>
                    <div>
                      <span className={classes.total_label}>Total Order:</span>
                      <span className={classes.total_amount}>
                        <Currencyfromat amount={total} />
                      </span>
                    </div>
                    
                    <button 
                      type='submit' 
                      disabled={loading || !basket?.length || !user}
                      className={classes.pay_button}
                    >
                      {loading ? (
                        <>
                          <span className={classes.spinner}></span>
                          Processing wait...
                        </>
                      ) : (
                        'Pay with Chapa'
                      )}
                    </button>
                    <div>

                    </div>
                    <p className={classes.redirect_note}>
                      <small>
                        You'll be redirected to Chapa's secure payment page to complete your purchase.
                        {!user && ' Please sign in to continue.'}
                      </small>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LayOut>
  );
}