import {React} from 'react';
import axios from 'axios';

const url = process.env.REACT_APP_URL;
const port = process.env.REACT_APP_PORT_DATABASE_MONGO_CATEGORY_CRUD_DATA;

const getAll = async (page) => {
  console.log(page);
  const response = await axios.get(url + ':' + port + '/categories');
  return response.data;
};

const getById = (id) => {
  return id;
};

const create = (params) => {

};

const update = (id, category, config) => {
  const response = axios.post(url + ':' + port + '/categories/edit/' + id, category, config);
  return response.data;
};

const deleteById = (id) => {
  const response = axios.get(url + ':' + port + '/categories/delete/' + id);
  return response.data;
};

const deleteMany = (ids) => {

};

export {getAll, update, deleteById}
