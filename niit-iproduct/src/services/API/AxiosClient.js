import axios from 'axios';

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
const store = (url, port, collection, data, config) => {
  const response = axios.post(url + ':' + port + '/' + collection + '/add', data, config);
  return response.data;
};
const update = (url, port, collection, id, data, config) => {
  const response = axios.post(url + ':' + port + '/' + collection + '/edit/' + id, data, config);
  return response.data;
};
const destroyById = (url, port, collection, id) => {
  const response = axios.get(url + ':' + port + '/' + collection + '/delete/' + id);
  return response.data;
};
export {store, update, destroyById};
