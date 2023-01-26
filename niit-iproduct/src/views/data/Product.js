import {React, useEffect, useState} from 'react'
import {Link} from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormSelect,
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import {
  cilPencil,
  cilTrash
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {create, edit, deleteById} from "../../services/API/Product/ProductClient";
import {useTranslation} from "react-i18next";

const url = process.env.REACT_APP_URL;
const category_port = process.env.REACT_APP_PORT_DATABASE_MONGO_CATEGORY_CRUD_DATA;
const product_port = process.env.REACT_APP_PORT_DATABASE_MONGO_PRODUCT_CRUD_DATA;
const DataProduct = () => {
  const [validated, setValidated] = useState(false);
  const [productSearch, setProductSearch] = useState({hits: []});
  const [id, setId] = useState(0);
  const [action, setAction] = useState({hits: []});
  const LIMIT = process.env.REACT_APP_LIMIT_DATA_RETURN_TABLE;
  // Generate a random number and convert it to base 36 (0-9a-z): TOKEN CHƯA ĐƯỢC SỬ DỤNG
  const token = Math.random().toString(36).substr(2); // remove `0.`
  const config = {
    headers: {Authorization: `Bearer ${token}`}
  };
  const [state, setState] = useState({
    editor: null
  });
  const loadData = async () => {
    const data = await axios.get(url + ':' + product_port + '/products');
    const dataJ = await data.data;
    setData(dataJ);
  };
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(0);
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const [productPerPage] = useState(LIMIT);
  const lastProduct = number * productPerPage;
  const firstProduct = lastProduct - productPerPage;
  const currentData = data.slice(firstProduct, lastProduct);
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(product.length / productPerPage); i++) {
    pageNumber.push(i);
  }
  const changePage = (pageNumber) => {
    setNumber(pageNumber);
  };
  useEffect(() => {
    const getData = async () => {
      const dataC = await axios.get(url + ':' + category_port + '/categories');
      const dataJC = await dataC.data;
      setCategory(dataJC);
      const dataP = await axios.get(url + ':' + product_port + '/products');
      const dataJP = await dataP.data;
      setData(dataJP);
    };
    getData();
    const editor = (
      <CKEditor
        editor={ClassicEditor}
        required
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({event, editor, data});
          changeTextarea(data);
        }}
        onBlur={(event, editor) => {
          console.log('Blur.', editor);
        }}
        onFocus={(event, editor) => {
          console.log('Focus.', editor);
        }}
      />
    );
    setState({...state, editor: editor});
  }, [load]);
  const changeInput = (value) => {
    setProduct({
      name: value
    })
  };
  const changeInputSearch = async (value) => {
    setProductSearch({
      name: value
    });
    const data = await axios.get(url + ':' + product_port + '/products/find?name=' + value);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const changeTextarea = (value) => {
    setProduct({
      full_description: value
    })
  };
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log(form);
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setValidated(false);
      const product = {
        category_id: form.categoryId.value,
        name: form.productName.value,
        short_description: form.productShortDescription.value,
        full_description: form.productFullDescription.value,
        unit: form.productUnit.value,
        currency: form.productCurrency.value,
        price: form.productPrice.value
      };
      console.log(action);
      console.log(product);
      if (action === 'edit') {
        edit(id, product, config);
      } else {
        create(product, config);
      }
      loadData();
    }
  };
  const editItem = (event, id) => {
    setId(id);
    setAction('edit');
    axios.get(url + ':' + product_port + '/products/edit/' + id)
      .then(res => {
        setProduct(res.data);
        const editor = (
          <CKEditor
            editor={ClassicEditor}
            required
            data={res.data.full_description ?? ''}
            onReady={editor => {
              // You can store the "editor" and use when it is needed.
              editor.setData(res.data.full_description);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              console.log({event, editor, data});
              changeTextarea(data);
            }}
            onBlur={(event, editor) => {
              console.log('Blur.', editor);
            }}
            onFocus={(event, editor) => {
              console.log('Focus.', editor);
            }}
          />
        );
        setState({...state, editor: editor});
      })
      .catch(error => console.log(error));
  };
  const deleteItem = (event, id) => {
    setId(id);
    setAction({'action': 'delete'});
    deleteById(id);
    setLoad(1);
  };
  const [t, i18n] = useTranslation('common');
  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{t('product.title')}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              {/* category_id */}
              <div className="mb-3">
                <CFormLabel htmlFor="categoryId">{t('product.category_name')}</CFormLabel>
                <CFormSelect feedbackInvalid={t('product.validate_input_category_name')} id="categoryId" value={product.category_id} required>
                  <option></option>
                  {
                    category.map((item, index) => (
                      <option key={index} value={item._id}>{item.name}</option>
                    ))
                  }
                </CFormSelect>
              </div>
              {/* name */}
              <div className="mb-3">
                <CFormLabel htmlFor="productName">{t('product.name')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('product.validate_input_name')} id="productName" value={product.name}
                            required/>
              </div>
              <div className="col-auto">
                <CButton type="submit" className="mb-3">
                  {t('btn_get_data')}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <div className="mb-3">
          <CFormLabel htmlFor="productSearchName">{t('product.search')}</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text" id="productSearchName"
                      placeholder={t('product.validate_input_name')} value={productSearch.name} required/>
        </div>
        <CTable bordered borderColor='primary'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">{t('column_id')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('product.column_name')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('column_action')}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((item, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>
                  <Link onClick={e => editItem(e, item._id)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;
                  <Link onClick={(e) => {
                    if (window.confirm(t('product.confirm_delete'))) {
                      deleteItem(event, item._id);
                    }
                  }}><CIcon icon={cilTrash}/></Link>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <div className="my-3 text-center">
          <button
            className="px-3 py-1 m-1 text-center btn-primary"
            onClick={() => setNumber(number - 1)}>
            {t('paginate_previous')}
          </button>
          {pageNumber.map((element, index) => {
            return (
              <button key={index}
                      className="px-3 py-1 m-1 text-center btn-outline-dark"
                      onClick={() => changePage(element)}>
                {element}
              </button>
            );
          })}
          <button
            className="px-3 py-1 m-1 text-center btn-primary"
            onClick={() => setNumber(number + 1)}>
            {t('paginate_next')}
          </button>
        </div>
      </CCol>
    </CRow>
  )
};

export default DataProduct
