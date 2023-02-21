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
const crawl = (url, port, collection, data, config) => {
  const responseList = axios.post(url + ':' + port + '/' + collection + '/crawl/list', data, config);
  const responseDetail = axios.post(url + ':' + port + '/' + collection + '/crawl/detail', data, config);
  return responseDetail.data;
};
const store = (url, port, collection, data, config) => {
  const response = axios.post(url + ':' + port + '/' + collection + '/add', data, config);
  return response.data;
};
const update = (url, port, collection, id, data, config) => {
  const response = axios.post(url + ':' + port + '/' + collection + '/edit/' + id, data, config);
  return response.data;
};
const destroyById = (url, port, collection, id, data, config) => {
  const response = axios.post(url + ':' + port + '/' + collection + '/delete/' + id, data, config);
  return response.data;
};
export {crawl, store, update, destroyById};
