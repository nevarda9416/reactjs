import {React, useEffect, useState, useCallback} from 'react'
import axios from 'axios';
import {useParams} from "react-router-dom";
const url = process.env.REACT_APP_URL;
const port = process.env.REACT_APP_PORT_DATABASE_MONGO_CATEGORY_CRUD_DATA;

  const getAll = async() => {
    const [validated, setValidated] = useState(false);
    const [categories, setCategories] = useState({hits: []});
    const [category, setCategory] = useState({hits: []});
    const [categorySearch, setCategorySearch] = useState({hits: []});
    const {action, id} = useParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalCategories, setTotalCategories] = useState(0);
    let LIMIT = process.env.REACT_APP_LIMIT_DATA_RETURN_TABLE;

    return await axios.get(url + ':' + port + '/categories')
        .then(res => {
          console.log(res.data);
          return res.data;
        })
        .then(res => {
          console.log(currentPage);
          setTotalCategories(res.length);
          res = res.slice(
            (currentPage - 1) * LIMIT,
            (currentPage - 1) * LIMIT + LIMIT
          );
          setCategories(res);
        })
        .catch(error => console.log(error));

  };
  const getById = (id) => {
    return id;
  };
  deleteById: (id) => {

  };
  deleteMany: (id) => {

  };
  create: (params) => {

  };
  update: (id, params) => {

  };

export {getAll,getById};
