import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../../Services/Paymentservices';
import { db } from '../../Utility/firbase';
import { DataContext } from '../../components/Dataprovider/Dataprovider';
import { Type } from '../../Utility/action.type';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

const PaymentSuccess = () => {
  const [status, setStatus] = useState('Verifying...');
  const [countdown, setCountdown] = useState(3);
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(DataContext);
  const { user } = state || { user: null };

  useEffect(() => {
    const verifyAndSaveOrder = async () => {
      try {
        setStatus('Verifying payment...');
        
        // Get pending order from localStorage
        const pendingOrderStr = localStorage.getItem('pendingOrder');
        let pendingOrder = null;
        
        if (pendingOrderStr) {
          try {
            pendingOrder = JSON.parse(pendingOrderStr);
            console.log('✅ Pending order found:', pendingOrder);
          } catch (e) {
            console.error('Failed to parse pendingOrder:', e);
          }
        }
        
        // Get txRef
        const params = new URLSearchParams(location.search);
        let txRef = params.get('tx_ref') || params.get('reference');
        
        if (!txRef) {
          txRef = localStorage.getItem('txRef');
        }
        
        if (!txRef && pendingOrder) {
          txRef = pendingOrder.txRef;
        }
        
        console.log('txRef:', txRef);
        console.log('User UID:', user?.uid);
        console.log('Pending order basket:', pendingOrder?.basket);

        if (!txRef) {
          setStatus('❌ Transaction reference not found');
          return;
        }

        // Verify payment
        const verificationResult = await verifyPayment(txRef);
        console.log('Verification result:', verificationResult);

        if (verificationResult?.success === true && verificationResult?.paid === true) {
          
          // ✅ USE BASKET FROM PENDING ORDER
          let orderBasket = pendingOrder?.basket || [];
          
          console.log('✅ BASKET TO SAVE:', orderBasket);
          console.log('✅ NUMBER OF ITEMS:', orderBasket.length);
          
          if (orderBasket.length === 0) {
            console.error('❌ NO BASKET ITEMS FOUND!');
            setStatus('⚠️ Payment successful but no items found in order');
          }

          // Prepare order data
          const orderData = {
            basket: orderBasket,
            amount: parseFloat(pendingOrder?.amount) || 0,
            created: Timestamp.now(),
            txRef: txRef,
            status: 'completed',
            paymentDate: new Date().toISOString(),
            paymentDetails: verificationResult.details || {}
          };

          console.log('FINAL ORDER DATA:', orderData);

          // SAVE TO FIRESTORE
          if (user && user.uid) {
            try {
              const orderRef = doc(db, 'users', user.uid, 'orders', txRef);
              await setDoc(orderRef, orderData);
              
              console.log('✅✅✅ ORDER SAVED WITH', orderBasket.length, 'ITEMS');
              
              // Clear basket
              if (dispatch) {
                dispatch({ type: Type.EMPTY_BASKET });
              }
              
              // Clear localStorage
              localStorage.removeItem('txRef');
              localStorage.removeItem('pendingOrder');
              
              setStatus(`✅ Payment Successful! ${orderBasket.length} item(s) saved.`);
              
              setTimeout(() => {
                navigate('/orders');
              }, 2000);
              
            } catch (firestoreError) {
              console.error('FIRESTORE ERROR:', firestoreError);
              setStatus('✅ Payment successful but order save failed.');
            }
          } else {
            // Save to localStorage for guest
            const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]');
            localOrders.push({
              ...orderData,
              id: txRef,
              userId: 'guest',
              savedAt: new Date().toISOString()
            });
            localStorage.setItem('localOrders', JSON.stringify(localOrders));
            setStatus(`✅ Payment successful! ${orderBasket.length} item(s) saved.`);
            setTimeout(() => {
              navigate('/signin');
            }, 2000);
          }
        } else {
          setStatus('❌ Payment verification failed');
        }
        
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('❌ Error processing payment');
      }
    };

    verifyAndSaveOrder();
  }, [location, user, dispatch, navigate]);

  useEffect(() => {
    if (status.includes('Successful') && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0 && status.includes('Successful')) {
      if (user?.uid) {
        navigate('/orders');
      } else {
        navigate('/signin');
      }
    }
  }, [status, countdown, navigate, user]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '40px',
        borderRadius: '20px',
        maxWidth: '500px'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          {status.includes('Successful') ? '🎉 ' : '⏳ '}
          {status}
        </h1>
        
        {status.includes('Successful') && (
          <button
            onClick={() => user?.uid ? navigate('/orders') : navigate('/signin')}
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '15px'
            }}
          >
            {user?.uid ? 'View My Orders' : 'Login to Save'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;