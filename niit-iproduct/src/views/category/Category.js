import {React, useEffect, useState, useCallback} from 'react'
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
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react';
import {
  cilPencil,
  cilTrash
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import Pagination from 'src/components/Pagination';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {getAll, update, deleteById} from "../../services/API/Category/CategoryClient";

const url = process.env.REACT_APP_URL;
const port = process.env.REACT_APP_PORT_DATABASE_MONGO_CATEGORY_CRUD_DATA;
const Category = () => {
  const [validated, setValidated] = useState(false);
  const [categories, setCategories] = useState({hits: []});
  const [category, setCategory] = useState({hits: []});
  const [categorySearch, setCategorySearch] = useState({hits: []});
  const [id, setId] = useState(0);
  const [action, setAction] = useState({hits: []});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(15);
  const LIMIT = process.env.REACT_APP_LIMIT_DATA_RETURN_TABLE;

  // Generate a random number and convert it to base 36 (0-9a-z)
  const token = Math.random().toString(36).substr(2); // remove `0.`
  const config = {
    headers: {Authorization: `Bearer ${token}`}
  };
  const [state, setState] = useState({
    editor: null
  });
  const onPageChanged = useCallback((event, page) => {
    event.preventDefault();
    setCurrentPage(page);
    loadData(page);
  });
  const loadData = (page) => {
    let res = getAll(page);
    res = res.then((res) => {
      console.log(res);
      setTotalCategories(res.length);
      res = res.slice(
        (page - 1) * 2,
        (page - 1) * 2 + 2
      );
      console.log(res);
      setCategories(res);
    });
  };
  useEffect(() => {
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
    loadData(1);
  }, []);
  const changeInput = (value) => {
    setCategory({
      name: value
    })
  };
  const changeInputSearch = (value) => {
    setCategorySearch({
      name: value
    });
    axios.get(url + ':' + port + '/categories/find?name=' + value)
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
  const changeTextarea = (value) => {
    setCategory({
      description: value
    })
  };
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log(form);
    //event.preventDefault();
    //event.stopPropagation();
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
        console.log(currentPage);
        setCurrentPage(currentPage);
        loadData(currentPage);
      } else {
        axios.post(url + ':' + port + '/categories/add', category, config)
          .then(res => {
            console.log(res);
            setCurrentPage(1);
            loadData(currentPage);
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
    setAction({'action':'delete'});
    deleteById(id);
    setCurrentPage(currentPage);
    loadData(currentPage);
  };
  return (
    <CRow>
      <CCol xs={4}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Thêm mới danh mục</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="categoryName">Tên danh mục</CFormLabel>
                <CFormInput onChange={e => changeInput(e.target.value)} type="text"
                            feedbackInvalid="Vui lòng nhập tên danh mục" id="categoryName" value={category.name}
                            required/>
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="exampleFormControlTextarea1">Mô tả</CFormLabel>
                <CFormTextarea className="d-none" onChange={e => changeTextarea(e.target.value)}
                               feedbackInvalid="Vui lòng nhập mô tả" id="categoryDescription" rows="3" required
                               value={category.description}/>
                <div className={"w-64"} id={"ck-editor-text"}>
                  {state.editor}
                </div>
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
      <CCol xs={8}>
        <div className="mb-3">
          <CFormLabel htmlFor="categoryName">Tìm kiếm danh mục</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text"
                      placeholder="Vui lòng nhập tên danh mục" value={categorySearch.name} required/>
        </div>
        <CTable bordered borderColor='primary'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Description</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {!validated && categories.map && categories.map(item => (
              <CTableRow>
                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>
                  {item.description &&
                  <span>
                                            {item.description.replace(/<[^>]+>/g, '')}
                                        </span>
                  }
                </CTableDataCell>
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
        <div className="pagination-wrapper">
          <Pagination
            totalRecords={totalCategories}
            pageLimit={LIMIT}
            pageNeighbours={2}
            onPageChanged={onPageChanged}
            currentPage={currentPage}
          />
        </div>
      </CCol>
    </CRow>
  )
};

export default Category
