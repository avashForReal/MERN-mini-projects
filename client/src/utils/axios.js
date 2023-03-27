import axios from 'axios';
// config
import { HOST_API_KEY } from '../config';

const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';

console.log(accessToken)

const axiosInstance = axios.create({
  baseURL: `${HOST_API_KEY}/api`
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
