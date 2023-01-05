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
import {update, deleteById} from "../../services/API/Category/CategoryClient";

const url = process.env.REACT_APP_URL;
const port = process.env.REACT_APP_PORT_DATABASE_MONGO_CATEGORY_CRUD_DATA;
const Product = () => {
  const [validated, setValidated] = useState(false);
  const [category, setCategory] = useState({hits: []});
  const [categorySearch, setCategorySearch] = useState({hits: []});
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
    const data = await axios.get(url + ':' + port + '/categories');
    const dataJ = await data.data;
    setPost(dataJ);
  };
  const [post, setPost] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const [postPerPage] = useState(LIMIT);
  const lastPost = number * postPerPage;
  const firstPost = lastPost - postPerPage;
  const currentPost = post.slice(firstPost, lastPost);
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(post.length / postPerPage); i++) {
    pageNumber.push(i);
  }
  const ChangePage = (pageNumber) => {
    setNumber(pageNumber);
  };
  useEffect(() => {
    const getData = async () => {
      const data = await axios.get(url + ':' + port + '/categories');
      const dataJ = await data.data;
      setPost(dataJ);
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
  }, []);
  const changeInput = (value) => {
    setCategory({
      name: value
    })
  };
  const changeInputSearch = async (value) => {
    setCategorySearch({
      name: value
    });
    const data = await axios.get(url + ':' + port + '/categories/find?name=' + value);
    const dataJ = await data.data;
    setPost(dataJ);
  };
  const changeTextarea = (value) => {
    setCategory({
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
      const category = {
        name: form.categoryName.value,
        dbname: form.categoryName.value,
        description: form.categoryDescription.value
      };
      console.log(action);
      if (action === 'edit') {
        update(id, category, config);
        loadData();
      } else {
        axios.post(url + ':' + port + '/categories/add', category, config)
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
    axios.get(url + ':' + port + '/categories/edit/' + id)
      .then(res => {
        setCategory(res.data);
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
    loadData();
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
              {/* category_id */}
              <div className="mb-3">
                <CFormLabel htmlFor="categoryName">Tên danh mục</CFormLabel>
                <CFormSelect feedbackInvalid="Vui lòng chọn danh mục" id="categoryName" aria-label="Default select example" required>
                  <option></option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3" disabled>Three</option>
                </CFormSelect>
              </div>
              {/* name */}
              <div className="mb-3">
                <CFormLabel htmlFor="productName">Tên sản phẩm</CFormLabel>
                <CFormInput onChange={e => changeInput(e.target.value)} type="text"
                            feedbackInvalid="Vui lòng nhập tên sản phẩm" id="productName" value={category.name}
                            required/>
              </div>
              {/* short_description */}
              <div className="mb-3">
                <CFormLabel htmlFor="exampleFormControlTextarea1">Mô tả ngắn</CFormLabel>
                <CFormTextarea onChange={e => changeTextarea(e.target.value)}
                               feedbackInvalid="Vui lòng nhập mô tả" id="categoryDescription" rows="3" required
                               value={category.description}/>
              </div>
              {/* full_description */}
              <div className="mb-3">
                <CFormLabel htmlFor="exampleFormControlTextarea1">Mô tả đầy đủ</CFormLabel>
                <div className={"w-64"} id={"ck-editor-text"}>
                  {state.editor}
                </div>
                <CFormTextarea className="d-none" onChange={e => changeTextarea(e.target.value)}
                               feedbackInvalid="Vui lòng nhập mô tả" id="categoryDescription" rows="3" required
                               value={category.description}/>
              </div>
              {/* unit */}
              <div className="mb-3">
                <CFormLabel htmlFor="categoryName">Đơn vị</CFormLabel>
                <CFormSelect feedbackInvalid="Vui lòng chọn danh mục" id="categoryName" aria-label="Default select example" required>
                  <option></option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3" disabled>Three</option>
                </CFormSelect>
              </div>
              {/* price */}
              <div className="mb-3">
                <CFormLabel htmlFor="productName">Giá</CFormLabel>
                <CFormInput onChange={e => changeInput(e.target.value)} type="text"
                            feedbackInvalid="Vui lòng nhập tên sản phẩm" id="productName" value={category.name}
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
          <CFormLabel htmlFor="categoryName">Tìm kiếm sản phẩm</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text"
                      placeholder="Vui lòng nhập tên sản phẩm" value={categorySearch.name} required/>
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
            {!validated && currentPost.map((item, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>
                  <Link onClick={e => editItem(e, item._id)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;
                  <Link onClick={(e) => {
                    if (window.confirm('Delete this category?')) {
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
                      onClick={() => ChangePage(element)}>
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
