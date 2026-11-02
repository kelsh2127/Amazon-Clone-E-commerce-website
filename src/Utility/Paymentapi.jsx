import { axiosInstance } from "../APII/axios";

const paymentApi = {
  initializePayment: async (paymentData) => {
    try {
      const response = await axiosInstance.post('/payment/chapa/initialize', paymentData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  verifyPayment: async (txRef) => {
    try {
      const response = await axiosInstance.get(`/payment/chapa/verify/${txRef}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }
};

export default paymentApi;