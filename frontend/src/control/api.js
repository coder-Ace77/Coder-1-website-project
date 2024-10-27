import axios from 'axios';

const request = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authtoken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
