import axios from 'axios';

const request = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

// console.log(process.env.BACKEND_URL);

// request.interceptors.request.use((config) => {
//   const sessionId = document.cookie.match(/(?<=sessionId=)[^;]*/);
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

export default request;
