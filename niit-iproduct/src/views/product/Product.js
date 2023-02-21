import { React, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
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
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { create, edit, deleteById } from "../../services/API/Product/ProductClient";
import { useTranslation } from "react-i18next";

const url = process.env.REACT_APP_URL;
const category_port = process.env.REACT_APP_PORT_DATABASE_MONGO_CATEGORY_CRUD_DATA;
const product_port = process.env.REACT_APP_PORT_DATABASE_MONGO_PRODUCT_CRUD_DATA;
const Product = () => {
  const [validated, setValidated] = useState(false);
  const [productSearch, setProductSearch] = useState({ hits: [] });
  const [id, setId] = useState(0);
  const [action, setAction] = useState({ hits: [] });
  const [loggedInUser, setLoggedInUser] = useState({ hits: [] });
  const LIMIT = process.env.REACT_APP_LIMIT_DATA_RETURN_TABLE;
  // Generate a random number and convert it to base 36 (0-9a-z): TOKEN CHƯA ĐƯỢC SỬ DỤNG
  const token = Math.random().toString(36).substr(2); // remove `0.`
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const [state, setState] = useState({
    editor: null,
    editShortDescription: null
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
  const [products, setProducts] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const productPerPage = LIMIT;
  const lastProduct = number * productPerPage;
  const firstProduct = lastProduct - productPerPage;
  const currentData = data.slice(firstProduct, lastProduct);
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(products.length / productPerPage); i++) {
    pageNumber.push(i);
  }
  const changePage = (pageNumber) => {
    setNumber(pageNumber);
  };
  useEffect(() => {
    const loggedInUser = localStorage.getItem('userLoggedInfo');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setLoggedInUser(foundUser);
    }
    const getData = async () => {
      const dataC = await axios.get(url + ':' + category_port + '/categories');
      const dataJC = await dataC.data;
      setCategory(dataJC);
      const dataP = await axios.get(url + ':' + product_port + '/products');
      const dataJP = await dataP.data;
      setProducts(dataJP);
      console.log(products);
      setData(dataJP);
    };
    getData();
    const editor = (
      <CKEditor
        editor={ClassicEditor}
        required
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({ event, editor, data });
          changeTextarea(data);
        }}
        onBlur={(_event, editor) => {
          console.log('Blur.', editor);
        }}
        onFocus={(_event, editor) => {
          console.log('Focus.', editor);
        }}
      />
    );
    const editShortDescription = (
      <CKEditor
        editor={ClassicEditor}
        required
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({ event, editor, data });
          changeShortDescription(data);
        }}
        onBlur={(_event, editor) => {
          console.log('Blur.', editor);
        }}
        onFocus={(_event, editor) => {
          console.log('Focus.', editor);
        }}
      />
    );
    setState({ ...state, editor: editor, editShortDescription: editShortDescription });
  }, [load]);
  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    setProduct({
      ...product,
      [name]: value
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
  const changeShortDescription = (value) => {
    setProduct({
      short_description: value
    })
  };
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log(form);
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setValidated(false);
      const loggedInUser = localStorage.getItem('userLoggedInfo');
      if (loggedInUser) {
        const foundUser = JSON.parse(loggedInUser);
        const config = {
          headers: { Authorization: `Bearer ${foundUser.token}` }
        };
        const product = {
          category_id: form.categoryId.value,
          name: form.productName.value,
          short_description: form.productShortDescription.value,
          full_description: form.productFullDescription.value,
          unit: form.productUnit.value,
          currency: form.productCurrency.value,
          price: form.productPrice.value,
          user_id: foundUser.id,
          system_type: 'default' // CRUD action, replace system_id
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
    }
  };
  const editItem = (id) => {
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
              console.log({ event, editor, data });
              changeTextarea(data);
            }}
            onBlur={(_event, editor) => {
              console.log('Blur.', editor);
            }}
            onFocus={(_event, editor) => {
              console.log('Focus.', editor);
            }}
          />
        );
        const editShortDescription = (
          <CKEditor
            editor={ClassicEditor}
            required
            data={res.data.short_description ?? ''}
            onReady={editor => {
              // You can store the "editor" and use when it is needed.
              editor.setData(res.data.short_description);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              console.log({ event, editor, data });
              changeShortDescription(data);
            }}
            onBlur={(_event, editor) => {
              console.log('Blur.', editor);
            }}
            onFocus={(_event, editor) => {
              console.log('Focus.', editor);
            }}
          />
        );
        setState({ ...state, editor: editor, editShortDescription: editShortDescription });
      })
      .catch(error => console.log(error));
  };
  const deleteItem = (id) => {
    setId(id);
    setAction({ 'action': 'delete' });
    const loggedInUser = localStorage.getItem('userLoggedInfo');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      const config = {
        headers: { Authorization: `Bearer ${foundUser.token}` }
      };
      const product = {
        user_id: foundUser.id
      };
      deleteById(id, product, config);
    }
    setLoad(1);
  };
  const [t] = useTranslation('common');
  const pagination =
    <div className="my-3 text-center">
      <button
        className="px-3 py-1 m-1 text-center btn btn-primary"
        onClick={() => {
          setNumber(1)
        }}>
        {t('paginate_first')}
      </button>
      <button
        className="px-3 py-1 m-1 text-center btn btn-primary"
        onClick={() => {
          if (number > 1)
            setNumber(number - 1)
          else
            setNumber(1)
        }}>
        {t('paginate_previous')}
      </button>
      {pageNumber.map((element, index) => {
        const className = (number === element) ? 'px-3 py-1 m-1 text-center btn btn-primary' : 'px-3 py-1 m-1 text-center btn btn-outline-dark'
        return (
          <span>{(element < number - 3 || element > number + 3 || element == number) &&
            <button key={index}
              className={className}
              onClick={() => changePage(element)}>
              {element}
            </button>
          }</span>
        );
      })}
      <button
        className="px-3 py-1 m-1 text-center btn btn-primary"
        onClick={() => {
          if (number < Math.ceil(products.length / productPerPage))
            setNumber(number + 1)
          else
            setNumber(Math.ceil(products.length / productPerPage))
        }}>
        {t('paginate_next')}
      </button>
      <button
        className="px-3 py-1 m-1 text-center btn btn-primary"
        onClick={() => {
          setNumber(Math.ceil(products.length / productPerPage))
        }}>
        {t('paginate_last')}
      </button>
    </div>
    ;
  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{t('product.add_or_edit')}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              {/* category_id */}
              <div className="mb-3">
                <CFormLabel htmlFor="categoryId">{t('category.label_name')}</CFormLabel>
                <CFormSelect feedbackInvalid={t('category.validate_input_name')} onChange={handleChange} id="categoryId" name="category_id" value={product.category_id} required>
                  <option></option>
                  {
                    category.map((item, index) => (
                      <option key={index || ''} value={item._id || ''}>{item.name || ''}</option>
                    ))
                  }
                </CFormSelect>
              </div>
              {/* name */}
              <div className="mb-3">
                <CFormLabel htmlFor="productName">{t('product.label_name')}</CFormLabel>
                <CFormInput type="text" onChange={handleChange}
                  feedbackInvalid={t('product.validate_input_name')} id="productName" name="name" value={product.name || ''}
                  required />
              </div>
              {/* short_description */}
              <div className="mb-3">
                <CFormLabel htmlFor="productShortDescription">{t('product.label_short_description')}</CFormLabel>
                <div className={"w-64"} id={"ck-editor-text"}>
                  {state.editShortDescription}
                </div>
                <CFormTextarea className="d-none" onChange={e => changeShortDescription(e.target.value)}
                  feedbackInvalid={t('product.validate_input_short_description')} id="productShortDescription" rows="3" required
                  value={product.short_description || ''} />
              </div>
              {/* full_description */}
              <div className="mb-3">
                <CFormLabel htmlFor="productFullDescription">{t('product.label_full_description')}</CFormLabel>
                <div className={"w-64"} id={"ck-editor-text"}>
                  {state.editor}
                </div>
                <CFormTextarea className="d-none" onChange={e => changeTextarea(e.target.value)}
                  feedbackInvalid={t('product.validate_input_full_description')} id="productFullDescription" rows="3" required
                  value={product.full_description || ''} />
              </div>
              {/* unit */}
              <div className="mb-3">
                <CFormLabel htmlFor="productUnit">{t('product.label_unit')}</CFormLabel>
                <CFormSelect feedbackInvalid={t('product.validate_input_unit')} onChange={handleChange} id="productUnit" name="unit" value={product.unit || ''} required>
                  <option></option>
                  <option value="chiếc">Chiếc</option>
                  <option value="cái">Cái</option>
                </CFormSelect>
              </div>
              {/* concurrency */}
              <div className="mb-3">
                <CFormLabel htmlFor="productCurrency">{t('product.label_currency')}</CFormLabel>
                <CFormInput type="text" onChange={handleChange}
                  feedbackInvalid={t('product.validate_input_currency')} id="productCurrency" name="currency" value={product.currency || ''}
                  required />
              </div>
              {/* price */}
              <div className="mb-3">
                <CFormLabel htmlFor="productPrice">{t('product.label_price')}</CFormLabel>
                <CFormInput type="text" onChange={handleChange}
                  feedbackInvalid={t('product.validate_input_price')} id="productPrice" name="price" value={product.price || ''}
                  required />
              </div>
              <div className="col-auto">
                <CButton type="submit" className="mb-3">
                  {t('btn_save')}
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
            placeholder={t('product.validate_input_name')} value={productSearch.name} required />
        </div>
        {pagination}
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
                  <Link onClick={() => editItem(item._id)}><CIcon icon={cilPencil} /></Link>&nbsp;&nbsp;
                  <Link onClick={() => {
                    if (window.confirm(t('product.confirm_delete'))) {
                      deleteItem(item._id);
                    }
                  }}><CIcon icon={cilTrash} /></Link>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        {pagination}
      </CCol>
    </CRow>
  )
};

export default Product
