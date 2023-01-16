import {React} from 'react';
import {store, update, destroyById} from "../AxiosClient";

const url = process.env.REACT_APP_URL;
const port = process.env.REACT_APP_PORT_DATABASE_MONGO_COMMENT_CRUD_DATA;
const collection = process.env.REACT_APP_COLLECTION_MONGO_COMMENT_NAME;

const create = (data, config) => {
  store(url, port, collection, data, config);
};

const edit = (id, data, config) => {
  update(url, port, collection, id, data, config);
};

const deleteById = (id) => {
  destroyById(url, port, collection, id);
};

export {create, edit, deleteById}
