import {React} from 'react';
import axios from 'axios';

const url = process.env.REACT_APP_URL;
const port = process.env.REACT_APP_PORT_DATABASE_MONGO_PRODUCT_CRUD_DATA;

const getById = (id) => {
  return id;
};

const create = (product, config) => {
  const response = axios.post(url + ':' + port + '/products/add', product, config);
  return response.data;
};

const update = (id, product, config) => {
  const response = axios.post(url + ':' + port + '/products/edit/' + id, product, config);
  return response.data;
};

const deleteById = (id) => {
  const response = axios.get(url + ':' + port + '/products/delete/' + id);
  return response.data;
};

const deleteMany = (ids) => {

};

export {create, update, deleteById}
