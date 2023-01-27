import {React, useEffect, useState} from 'react'
import {Link} from 'react-router-dom';
import {useTranslation} from "react-i18next";
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
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {create, edit, deleteById} from "../../services/API/Seo/SeoClient";

const url = process.env.REACT_APP_URL;
const seo_port = process.env.REACT_APP_PORT_DATABASE_MONGO_SEO_CRUD_DATA;
const seo_collection = process.env.REACT_APP_COLLECTION_MONGO_SEO_NAME;
const SEO = () => {
  const [validated, setValidated] = useState(false);
  const [seoSearch, setSeoSearch] = useState({hits: []});
  const [id, setId] = useState(0);
  const [action, setAction] = useState({hits: []});
  const [visible, setVisible] = useState(false);
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
    const data = await axios.get(url + ':' + seo_port + '/' + seo_collection);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(0);
  const [category, setCategory] = useState([]);
  const [seo, setSeo] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const [seoPerPage] = useState(LIMIT);
  const lastSeo = number * seoPerPage;
  const firstSeo = lastSeo - seoPerPage;
  const currentData = data.slice(firstSeo, lastSeo);
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(seo.length / seoPerPage); i++) {
    pageNumber.push(i);
  }
  const changePage = (pageNumber) => {
    setNumber(pageNumber);
  };
  useEffect(() => {
    const getData = async () => {
      const data = await axios.get(url + ':' + seo_port + '/' + seo_collection);
      const dataJ = await data.data;
      setData(dataJ);
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
  const changeInputName = (value) => {
    setSeo({
      name: value
    })
  };
  const changeInputSlug = (value) => {
    setSeo({
      slug: value
    })
  };
  const changeInputSearch = async (value) => {
    setSeoSearch({
      name: value
    });
    const data = await axios.get(url + ':' + seo_port + '/' + seo_collection + '/find?name=' + value);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const changeTextarea = (value) => {
    setSeo({
      description: value
    })
  };
  const handleSubmit = (event) => {
    const form = event.target;
    console.log(form);
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setValidated(false);
      const seo = {
        name: form.seoName.value,
        slug: form.seoSlug.value,
        description: form.seoDescription.value
      };
      console.log(action);
      console.log(seo);
      if (action === 'edit') {
        edit(id, seo, config);
      } else {
        create(seo, config);
      }
    }
    loadData();
  };
  const editItem = (event, id) => {
    setVisible(!visible);
    setId(id);
    setAction('edit');
    axios.get(url + ':' + seo_port + '/' + seo_collection + '/edit/' + id)
      .then(res => {
        setSeo(res.data);
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
            <strong>{t('seo.add_meta')}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              {/* meta_title */}
              <div className="mb-3">
                <CFormLabel htmlFor="seoMetaTitle">{t('seo.meta_title')}</CFormLabel>
                <CFormInput type="text" feedbackInvalid={t('seo.validate_input_meta_title')} id="seoMetaTitle" value={seo.meta_title} required/>
              </div>
              {/* meta_keyword */}
              <div className="mb-3">
                <CFormLabel htmlFor="seoMetaKeyword">{t('seo.meta_keyword')}</CFormLabel>
                <CFormInput type="text" feedbackInvalid={t('seo.validate_input_meta_keyword')} id="seoMetaKeyword" value={seo.meta_keyword} required/>
              </div>
              {/* meta_description */}
              <div className="mb-3">
                <CFormLabel htmlFor="seoDescription">{t('seo.meta_description')}</CFormLabel>
                <CFormTextarea feedbackInvalid={t('seo.validate_input_meta_description')} id="seoDescription" rows="3" value={seo.meta_description} required/>
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
          <CFormLabel htmlFor="seoSearchName">{t('seo.search_meta')}</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text" id="seoSearchName" placeholder={t('seo.validate_input_meta_title')} value={seoSearch.name} required/>
        </div>
        <CTable bordered borderColor='primary'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">{t('seo.column_meta_id')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('seo.meta_title')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('seo.column_meta_action')}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((item, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                <CTableDataCell>{item.meta_title}</CTableDataCell>
                <CTableDataCell>
                  {/*<Link onClick={() => setVisible(!visible)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;*/}
                  <Link onClick={e => editItem(e, item._id)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;
                  <Link onClick={(e) => {
                    if (window.confirm(t("seo.confirm_delete"))) {
                      deleteItem(event, item._id);
                    }
                  }}><CIcon icon={cilTrash}/></Link>
                </CTableDataCell>
                <CModal visible={visible} onClose={() => {setVisible(false); loadData()}}>
                  <CModalHeader>
                    <CModalTitle>{t('seo.edit_meta')}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CForm noValidate validated={validated} onSubmit={handleSubmit} id={'seoForm'}>
                      {/* meta_title */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="seoMetaTitle">{t('seo.meta_title')}</CFormLabel>
                        <CFormInput type="text" feedbackInvalid={t('seo.validate_input_meta_title')} id="seoMetaTitle" value={seo.meta_title} required/>
                      </div>
                      {/* meta_keyword */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="seoMetaKeyword">{t('seo.meta_keyword')}</CFormLabel>
                        <CFormInput type="text" feedbackInvalid={t('seo.validate_input_meta_keyword')} id="seoMetaKeyword" value={seo.meta_keyword} required/>
                      </div>
                      {/* meta_description */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="seoDescription">{t('seo.meta_description')}</CFormLabel>
                        <CFormTextarea feedbackInvalid={t('seo.validate_input_meta_description')} id="seoDescription" rows="3" value={seo.meta_description} required/>
                      </div>
                    </CForm>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => {setVisible(false);}}>
                      {t('btn_close')}
                    </CButton>
                    <CButton color="primary" type="submit" form={'seoForm'}>
                      {t('btn_save')}
                    </CButton>
                  </CModalFooter>
                </CModal>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <div className="my-3 text-center">
          <button className="px-3 py-1 m-1 text-center btn-primary" onClick={() => setNumber(number - 1)}>
            {t('paginate_previous')}
          </button>
          {pageNumber.map((element, index) => {
            return (
              <button key={index} className="px-3 py-1 m-1 text-center btn-outline-dark" onClick={() => changePage(element)}>
                {element}
              </button>
            );
          })}
          <button className="px-3 py-1 m-1 text-center btn-primary" onClick={() => setNumber(number + 1)}>
            {t('paginate_next')}
          </button>
        </div>
      </CCol>
    </CRow>
  )
};

export default SEO
