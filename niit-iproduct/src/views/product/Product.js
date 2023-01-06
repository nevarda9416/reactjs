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
import {update, deleteById} from "../../services/API/Product/ProductClient";

const url = process.env.REACT_APP_URL;
const category_port = process.env.REACT_APP_PORT_DATABASE_MONGO_CATEGORY_CRUD_DATA;
const product_port = process.env.REACT_APP_PORT_DATABASE_MONGO_PRODUCT_CRUD_DATA;
const Product = () => {
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
    setProduct(dataJ);
  };
  const [load, setLoad] = useState(0);
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const [productPerPage] = useState(LIMIT);
  const lastProduct = number * productPerPage;
  const firstProduct = lastProduct - productPerPage;
  const currentProduct = product.slice(firstProduct, lastProduct);
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
      ////
      const dataP = await axios.get(url + ':' + product_port + '/products');
      const dataJP = await dataP.data;
      setProduct(dataJP);
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
    setProduct(dataJ);
  };
  const changeTextarea = (value) => {
    setProduct({
      description: value
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

      };
      console.log(action);
      if (action === 'edit') {
        update(id, product, config);
        loadData();
      } else {
        axios.post(url + ':' + product_port + '/products/add', product, config)
          .then(res => {
            console.log(res);
            loadData();
            return res;
          })
          .catch(error => console.log(error));
      }
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
            data={res.data.description ?? ''}
            onReady={editor => {
              // You can store the "editor" and use when it is needed.
              editor.setData(res.data.description);
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
  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Thêm mới sản phẩm</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              {/* product_id */}
              <div className="mb-3">
                <CFormLabel htmlFor="categoryId">Tên danh mục</CFormLabel>
                <CFormSelect feedbackInvalid="Vui lòng chọn danh mục" id="categoryId" required>
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
                <CFormLabel htmlFor="productName">Tên sản phẩm</CFormLabel>
                <CFormInput onChange={e => changeInput(e.target.value)} type="text"
                            feedbackInvalid="Vui lòng nhập tên sản phẩm" id="productName" value={product.name}
                            required/>
              </div>
              {/* short_description */}
              <div className="mb-3">
                <CFormLabel htmlFor="productShortDescription">Mô tả ngắn</CFormLabel>
                <CFormTextarea onChange={e => changeTextarea(e.target.value)}
                               feedbackInvalid="Vui lòng nhập mô tả ngắn" id="productShortDescription" rows="3" required
                               value={product.short_description}/>
              </div>
              {/* full_description */}
              <div className="mb-3">
                <CFormLabel htmlFor="productFullDescription">Mô tả đầy đủ</CFormLabel>
                <div className={"w-64"} id={"ck-editor-text"}>
                  {state.editor}
                </div>
                <CFormTextarea className="d-none" onChange={e => changeTextarea(e.target.value)}
                               feedbackInvalid="Vui lòng nhập mô tả đầy đủ" id="productFullDescription" rows="3" required
                               value={product.full_description}/>
              </div>
              {/* unit */}
              <div className="mb-3">
                <CFormLabel htmlFor="productUnit">Đơn vị</CFormLabel>
                <CFormSelect feedbackInvalid="Vui lòng chọn đơn vị sản phẩm" id="productUnit" required>
                  <option></option>
                  <option value="1">Chiếc</option>
                </CFormSelect>
              </div>
              {/* concurrency */}
              <div className="mb-3">
                <CFormLabel htmlFor="productCurrency">Tiền tệ</CFormLabel>
                <CFormInput onChange={e => changeInput(e.target.value)} type="text"
                            feedbackInvalid="Vui lòng nhập loại tiền tệ" id="productCurrency" value={product.currency}
                            required/>
              </div>
              {/* price */}
              <div className="mb-3">
                <CFormLabel htmlFor="productPrice">Giá</CFormLabel>
                <CFormInput onChange={e => changeInput(e.target.value)} type="text"
                            feedbackInvalid="Vui lòng nhập giá sản phẩm" id="productPrice" value={product.price}
                            required/>
              </div>
              <div className="col-auto">
                <CButton type="submit" className="mb-3">
                  Lưu
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <div className="mb-3">
          <CFormLabel htmlFor="productSearchName">Tìm kiếm sản phẩm</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text" id="productSearchName"
                      placeholder="Vui lòng nhập tên sản phẩm" value={productSearch.name} required/>
        </div>
        <CTable bordered borderColor='primary'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentProduct.map((item, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>
                  <Link onClick={e => editItem(e, item._id)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;
                  <Link onClick={(e) => {
                    if (window.confirm('Delete this product?')) {
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
            Trước
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
            Sau
          </button>
        </div>
      </CCol>
    </CRow>
  )
};

export default Product
