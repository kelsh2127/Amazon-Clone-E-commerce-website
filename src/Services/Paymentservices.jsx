const API_BASE_URL = 'http://localhost:5010/clone-8e87a/us-central1/api';

export const initializePayment = async (paymentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/chapa/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
};

export const verifyPayment = async (txRef) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/chapa/verify/${txRef}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Verification error:', error);
    throw error;
  }
};