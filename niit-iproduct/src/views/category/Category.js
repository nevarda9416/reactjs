import { React, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
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
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { create, edit, deleteById } from "../../services/API/Category/CategoryClient";
import { useTranslation } from "react-i18next";

const url = process.env.REACT_APP_URL;
const port = process.env.REACT_APP_PORT_DATABASE_MONGO_CATEGORY_CRUD_DATA;
const Category = () => {
  const [validated, setValidated] = useState(false);
  const [categorySearch, setCategorySearch] = useState({ hits: [] });
  const [id, setId] = useState(0);
  const [action, setAction] = useState();
  const LIMIT = process.env.REACT_APP_LIMIT_DATA_RETURN_TABLE;
  const [state, setState] = useState({
    editor: null
  });
  const inputRef = useRef(null);
  const loadData = async () => {
    const data = await axios.get(url + ':' + port + '/categories');
    const dataJ = await data.data;
    setData(dataJ);
  };
  const [data, setData] = useState([]);
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const categoryPerPage = LIMIT;
  const lastCategory = number * categoryPerPage;
  const firstCategory = lastCategory - categoryPerPage;
  const currentData = data.slice(firstCategory, lastCategory);

  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(category.length / categoryPerPage); i++) {
    pageNumber.push(i);
  }
  const changePage = (pageNumber) => {
    setNumber(pageNumber);
  };
  const navigate = useNavigate();
  useEffect(() => {
    const loggedInUser = localStorage.getItem('userLoggedInfo');
    if (loggedInUser) {
      const getData = async () => {
        const data = await axios.get(url + ':' + port + '/categories');
        const dataJ = await data.data;
        setCategories(dataJ);
        setData(dataJ);
      };
      getData();
      const editor = (
        <CKEditor
          editor={ClassicEditor}
          required
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
          }}
          onBlur={(_event, editor) => {
            console.log('Blur.', editor);
          }}
          onFocus={(_event, editor) => {
            console.log('Focus.', editor);
          }}
        />
      );
      setState({ ...state, editor: editor });
    } else {
      navigate('/login');
    }
  }, []);
  const changeInput = (value) => {
    setCategory({
      ...category,
      name: value
    })
  };
  const changeInputSearch = async (value) => {
    setCategorySearch({
      name: value
    });
    const data = await axios.get(url + ':' + port + '/categories/find?name=' + value);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const changeTextarea = (value) => {
    setCategory({
      ...category,
      name: inputRef.current.value ?? '',
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
      const loggedInUser = localStorage.getItem('userLoggedInfo');
      if (loggedInUser) {
        const foundUser = JSON.parse(loggedInUser);
        const config = {
          headers: { Authorization: `Bearer ${foundUser.token}` }
        };
        const category = {
          name: form.categoryName.value,
          dbname: form.categoryName.value,
          description: form.categoryDescription.value,
          user_id: foundUser.id,
          system_type: 'default' // CRUD action, replace system_id
        };
        console.log(action);
        if (action === 'edit') {
          edit(id, category, config);
        } else {
          create(category, config);
        }
        setTimeout(function () {
          loadData();
        }, 500);
      }
    }
  };
  const editItem = (id) => {
    setId(id);
    setAction('edit');
    axios.get(url + ':' + port + '/categories/edit/' + id)
      .then(res => {
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
        setState({ ...state, editor: editor });
      })
      .catch(error => console.log(error));
    axios.get(url + ':' + port + '/categories/edit/' + id)
      .then(res => {
        setCategory(res.data);
      })
      .catch(error => console.log(error));
  };
  const deleteItem = (id) => {
    setId(id);
    setAction({ 'action': 'delete' });
    deleteById(id);
    loadData();
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
          if (number < Math.ceil(categories.length / categoryPerPage))
            setNumber(number + 1)
          else
            setNumber(Math.ceil(categories.length / categoryPerPage))
        }}>
        {t('paginate_next')}
      </button>
      <button
        className="px-3 py-1 m-1 text-center btn btn-primary"
        onClick={() => {
          setNumber(Math.ceil(categories.length / categoryPerPage))
        }}>
        {t('paginate_last')}
      </button>
    </div>
    ;
  return (
    <CRow>
      <CCol xs={4}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{t('category.add_or_edit')}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="categoryName">{t('category.label_name')}</CFormLabel>
                <CFormInput onChange={e => changeInput(e.target.value)} type="text"
                  feedbackInvalid={t('category.validate_input_name')} id="categoryName" value={category.name || ''}
                  required ref={inputRef} />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="exampleFormControlTextarea1">{t('category.label_description')}</CFormLabel>
                <div className={"w-64"} id={"ck-editor-text"}>
                  {state.editor}
                </div>
                <CFormTextarea className="d-none" onChange={e => changeTextarea(e.target.value)}
                  feedbackInvalid={t('category.validate_input_description')} id="categoryDescription" rows="3" required
                  value={category.description || ''} />
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
      <CCol xs={8}>
        <div className="mb-3">
          <CFormLabel htmlFor="categoryName">{t('category.search')}</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text"
            placeholder={t('category.validate_input_name')} value={categorySearch.name || ''} required />
        </div>
        {pagination}
        <CTable bordered borderColor='primary'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">{t('column_id')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('category.column_name')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('category.column_description')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('column_action')}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((item, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>
                  {item.description &&
                    <span>{item.description.replace(/<[^>]+>/g, '')}</span>
                  }
                </CTableDataCell>
                <CTableDataCell>
                  <Link onClick={() => editItem(item._id)}><CIcon icon={cilPencil} /></Link>&nbsp;&nbsp;
                  <Link onClick={() => {
                    if (window.confirm(t('category.confirm_delete'))) {
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

export default Category
