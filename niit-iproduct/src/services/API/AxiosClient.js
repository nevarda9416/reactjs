import axios from 'axios';
import queryString from 'query-string';

const AxiosClient = axios.create(
  {
    baseURL: 'http://localhost:3001',
    headers: {
      'Content-Type': 'application/json'
    },
  }
);
AxiosClient.interceptors.request.use(async (config) => {
  return config;
});
AxiosClient.interceptors.response.use(async (response) => {
  if (response && response.data) {
    return response.data;
  }
}, (error) => {
  throw error;
});
export default AxiosClient;
