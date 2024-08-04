import axios from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 20000,
  withCredentials: true, // Ensure this is set
});

request.interceptors.request.use((config) => {
  const sessionId = document.cookie.match(/(?<=sessionId=)[^;]*/);
  if (sessionId) {
    console.log('Session ID:', sessionId[0]);
  }else{
    console.log('No session ID found');
  }
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

export default request;
