import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5010/clone-8e87a/us-central1/api',  // Hardcoded URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { axiosInstance };