import { React, useEffect, useState } from 'react'
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
  CTableRow,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react';
import {
  cilPencil,
  cilTrash
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import { create, edit, deleteById } from "../../services/API/Tag/TagClient";
import { useTranslation } from "react-i18next";

const url = process.env.REACT_APP_URL;
const tag_port = process.env.REACT_APP_PORT_DATABASE_MONGO_TAG_CRUD_DATA;
const tag_collection = process.env.REACT_APP_COLLECTION_MONGO_TAG_NAME;
const Tag = () => {
  const [validated, setValidated] = useState(false);
  const [tagSearch, setTagSearch] = useState({ hits: [] });
  const [id, setId] = useState(0);
  const [action, setAction] = useState({ hits: [] });
  const [visible, setVisible] = useState(false);
  const LIMIT = process.env.REACT_APP_LIMIT_DATA_RETURN_TABLE;
  const loadData = async () => {
    const data = await axios.get(url + ':' + tag_port + '/' + tag_collection);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const [data, setData] = useState([]);
  const [tag, setTag] = useState([]);
  const [tags, setTags] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const tagPerPage = LIMIT;
  const lastTag = number * tagPerPage;
  const firstTag = lastTag - tagPerPage;
  const currentData = data.slice(firstTag, lastTag);
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(tag.length / tagPerPage); i++) {
    pageNumber.push(i);
  }
  const changePage = (pageNumber) => {
    setNumber(pageNumber);
  };
  const navigate = useNavigate();
  useEffect(() => {
    const expiredTime = localStorage.getItem('expiredTime');
    const loggedInUser = localStorage.getItem('userLoggedInfo');
    if (loggedInUser && Date.now() <= expiredTime) {
      const getData = async () => {
        const data = await axios.get(url + ':' + tag_port + '/' + tag_collection);
        const dataJ = await data.data;
        setTags(dataJ);
        setData(dataJ);
      };
      getData();
    } else {
      navigate('/login');
    }
  }, []);
  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    setTag({
      ...tag,
      [name]: value
    })
  };
  const changeInputSearch = async (value) => {
    setTagSearch({
      name: value
    });
    const data = await axios.get(url + ':' + tag_port + '/' + tag_collection + '/find?name=' + value);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const handleSubmit = (event) => {
    const form = event.target;
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
        const tag = {
          name: form.tagName.value,
          slug: form.tagSlug.value,
          description: form.tagDescription.value,
          user_id: foundUser.id,
          system_type: 'default' // CRUD action, replace system_id
        };
        console.log(action);
        console.log(tag);
        if (action === 'edit') {
          edit(id, tag, config);
          alert(t('tag.alert_edit_success'));
        } else {
          create(tag, config);
          // Reset form input data
          form.tagName.value = '';
          form.tagSlug.value = '';
          form.tagDescription.value = '';
          alert(t('tag.alert_create_success'));
        }
        setTimeout(function () { // After timeout call list data again
          loadData();
        }, 500);
      }
    }
  };
  const editItem = (id) => {
    setVisible(!visible);
    setId(id);
    setAction('edit');
    axios.get(url + ':' + tag_port + '/' + tag_collection + '/edit/' + id)
      .then(res => {
        setTag(res.data);
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
      const tag = {
        user_id: foundUser.id
      };
      deleteById(id, tag, config);
      alert(t('tag.alert_delete_success'));
      setTimeout(function () { // After timeout call list data again
        loadData();
      }, 500);
    }
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
          if (number < Math.ceil(tags.length / tagPerPage))
            setNumber(number + 1)
          else
            setNumber(Math.ceil(tags.length / tagPerPage))
        }}>
        {t('paginate_next')}
      </button>
      <button
        className="px-3 py-1 m-1 text-center btn btn-primary"
        onClick={() => {
          setNumber(Math.ceil(tags.length / tagPerPage))
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
            <strong>{t('tag.add')}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              {/* name */}
              <div className="mb-3">
                <CFormLabel htmlFor="tagName">{t('tag.label_name')}</CFormLabel>
                <CFormInput type="text" feedbackInvalid={t('tag.validate_input_name')} id="tagName" name="name" required onChange={handleChange} />
              </div>
              {/* slug */}
              <div className="mb-3">
                <CFormLabel htmlFor="tagSlug">{t('tag.label_slug')}</CFormLabel>
                <CFormInput type="text" feedbackInvalid={t('tag.validate_input_slug')} id="tagSlug" name="slug" required onChange={handleChange} />
              </div>
              {/* description */}
              <div className="mb-3">
                <CFormLabel htmlFor="tagDescription">{t('tag.label_description')}</CFormLabel>
                <CFormTextarea feedbackInvalid={t('tag.validate_input_description')} id="tagDescription" name="description" rows="3" required onChange={handleChange} />
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
          <CFormLabel htmlFor="tagSearchName">{t('tag.search')}</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text" id="tagSearchName"
            placeholder={t('tag.validate_input_name')} value={tagSearch.name} required />
        </div>
        {pagination}
        <CTable bordered borderColor='primary'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">{t('column_id')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('tag.column_name')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('column_action')}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((item, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>
                  {/*<Link onClick={() => setVisible(!visible)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;*/}
                  <Link onClick={e => editItem(item._id)}><CIcon icon={cilPencil} /></Link>&nbsp;&nbsp;
                  <Link onClick={(e) => {
                    if (window.confirm(t('tag.confirm_delete'))) {
                      deleteItem(item._id);
                    }
                  }}><CIcon icon={cilTrash} /></Link>
                </CTableDataCell>
                <CModal visible={visible} onClose={() => { setVisible(false); loadData() }}>
                  <CModalHeader>
                    <CModalTitle>{t('tag.edit')}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CForm noValidate validated={validated} onSubmit={handleSubmit} id={'tagForm'}>
                      {/* name */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="tagName">{t('tag.label_name')}</CFormLabel>
                        <CFormInput type="text" feedbackInvalid={t('tag.validate_input_name')} id="tagName" name="name" value={tag.name || ''} required onChange={handleChange} />
                      </div>
                      {/* slug */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="tagSlug">{t('tag.label_slug')}</CFormLabel>
                        <CFormInput type="text" feedbackInvalid={t('tag.validate_input_slug')} id="tagSlug" name="slug" value={tag.slug || ''} required onChange={handleChange} />
                      </div>
                      {/* description */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="tagDescription">{t('tag.label_description')}</CFormLabel>
                        <CFormTextarea feedbackInvalid={t('tag.validate_input_description')} id="tagDescription" name="description" rows="3" required value={tag.description || ''} onChange={handleChange} />
                      </div>
                    </CForm>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => { setVisible(false); }}>
                      {t('btn_close')}
                    </CButton>
                    <CButton color="primary" type="submit" form={'tagForm'}>
                      {t('btn_save')}
                    </CButton>
                  </CModalFooter>
                </CModal>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        {pagination}
      </CCol>
    </CRow>
  )
};

export default Tag
