import React, { useState, useContext, useEffect } from 'react';
import paymentApi from '../../Utility/Paymentapi';
import { DataContext } from '../../components/Dataprovider/Dataprovider';
const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { state } = useContext(DataContext);
  const { user, basket } = state || { user: null, basket: [] };
  const calculateTotal = () => {
    if (!basket || basket.length === 0) return 0;
    return basket.reduce((total, item) => {
      const price = parseFloat(item?.price) || 0;
      const quantity = parseInt(item?.amount) || 1;
      return total + (price * quantity);
    }, 0);
  };
  const [formData, setFormData] = useState({
    amount: calculateTotal().toFixed(2),
    email: user?.email || '',
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ')[1] || '',
  });
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      amount: calculateTotal().toFixed(2)
    }));
  }, [basket]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // DEBUG: Log basket before checkout
    console.log('🔍 CHECKOUT DEBUG:');
    console.log('Basket length:', basket?.length);
    console.log('Full basket:', JSON.stringify(basket, null, 2));
    if (!basket || basket.length === 0) {
      setError('Your basket is empty. Please add items first.');
      return;
    }

    if (calculateTotal() <= 0) {
      setError('Invalid total amount.');
      return;
    }

    setLoading(true);

    const txRef = `tx-${Date.now()}`;

    try {
      // Prepare order data with FULL basket details
      const orderItems = basket.map(item => ({
        id: item.id || Date.now(),
        title: item.title || item.name || 'Product',
        price: Number(item.price) || 0,
        amount: Number(item.amount) || 1,
        image: item.image || item.img || 'https://via.placeholder.com/80',
      }));

      console.log('📦 Items to save:', orderItems);

      const response = await paymentApi.initializePayment({
        amount: formData.amount,
        currency: 'ETB',
        email: formData.email.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        txRef,
      });

      // Save to localStorage
      const orderToSave = {
        txRef: txRef,
        amount: formData.amount,
        basket: orderItems,
        userId: user?.uid,
        userEmail: user?.email,
        timestamp: Date.now()
      };
      
      localStorage.setItem('pendingOrder', JSON.stringify(orderToSave));
      
      console.log('💾 Saved to localStorage:', orderToSave);
      console.log('✅ Items saved:', orderToSave.basket.length);

      window.location.href = response.checkoutUrl;
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  // Show current basket
  if (!basket || basket.length === 0) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Your basket is empty 🛒</h2>
        <button onClick={() => window.location.href = '/'}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '50px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Checkout</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Order Summary ({basket.length} items):</h3>
        {basket.map((item, i) => (
          <div key={i} style={{ marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
            <strong>{item.title || item.name}</strong><br />
            Quantity: {item.amount || 1} × ${(item.price || 0).toFixed(2)} = ${((item.price || 0) * (item.amount || 1)).toFixed(2)}
          </div>
        ))}
        <hr />
        <h3>Total: ${calculateTotal().toFixed(2)}</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="Email"
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          placeholder="First Name"
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          placeholder="Last Name"
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '15px', background: '#ff9900', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? 'Processing...' : `Pay $${calculateTotal().toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

export default Checkout;


