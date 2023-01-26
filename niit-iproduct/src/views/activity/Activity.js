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
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormSelect
} from '@coreui/react';
import {
  cilPencil,
  cilTrash
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {create, edit, deleteById} from "../../services/API/Activity/ActivityClient";
import {useTranslation} from "react-i18next";

const url = process.env.REACT_APP_URL;
const activity_port = process.env.REACT_APP_PORT_DATABASE_MONGO_ACTIVITY_CRUD_DATA;
const activity_collection = process.env.REACT_APP_COLLECTION_MONGO_ACTIVITY_NAME;
const Activity = () => {
  const [validated, setValidated] = useState(false);
  const [activitySearch, setActivitySearch] = useState({hits: []});
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
    const data = await axios.get(url + ':' + activity_port + '/' + activity_collection);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(0);
  const [category, setCategory] = useState([]);
  const [activity, setActivity] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const [activityPerPage] = useState(LIMIT);
  const lastActivity = number * activityPerPage;
  const firstActivity = lastActivity - activityPerPage;
  const currentData = data.slice(firstActivity, lastActivity);
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(activity.length / activityPerPage); i++) {
    pageNumber.push(i);
  }
  const changePage = (pageNumber) => {
    setNumber(pageNumber);
  };
  useEffect(() => {
    const getData = async () => {
      const data = await axios.get(url + ':' + activity_port + '/' + activity_collection);
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
    setActivity({
      name: value
    })
  };
  const changeInputSlug = (value) => {
    setActivity({
      slug: value
    })
  };
  const changeInputSearch = async (value) => {
    setActivitySearch({
      name: value
    });
    const data = await axios.get(url + ':' + activity_port + '/' + activity_collection + '/find?name=' + value);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const changeTextarea = (value) => {
    setActivity({
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
      const activity = {
        name: form.activityName.value,
        slug: form.activitySlug.value,
        description: form.activityDescription.value
      };
      console.log(action);
      console.log(activity);
      if (action === 'edit') {
        edit(id, activity, config);
      } else {
        create(activity, config);
      }
    }
    loadData();
  };
  const editItem = (event, id) => {
    setVisible(!visible);
    setId(id);
    setAction('edit');
    axios.get(url + ':' + activity_port + '/' + activity_collection + '/edit/' + id)
      .then(res => {
        setActivity(res.data);
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
            <strong>{t('activity.add')}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              {/* Subject */}
              <div className="mb-3">
                <CFormLabel htmlFor="activitySubject">{t('activity.label_subject')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('activity.validate_input_subject')} id="activitySubject" value={activity.subject}
                            required/>
              </div>
              {/* Content */}
              <div className="mb-3">
                <CFormLabel htmlFor="activityContent">{t('activity.label_content')}</CFormLabel>
                <CFormTextarea feedbackInvalid={t('activity.validate_input_content')} id="activityContent" rows="3" required
                               value={activity.content}/>
              </div>
              {/* URL */}
              <div className="mb-3">
                <CFormLabel htmlFor="activityUrl">{t('activity.label_url')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('activity.validate_input_url')} id="activityUrl" value={activity.url}
                            required/>
              </div>
              {/* Method */}
              <div className="mb-3">
                <CFormLabel htmlFor="activityMethod">{t('activity.label_method')}</CFormLabel>
                <CFormSelect feedbackInvalid={t('product.validate_input_method')} id="activityMethod" value={activity.method} required>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </CFormSelect>
              </div>
              {/* Function */}
              <div className="mb-3">
                <CFormLabel htmlFor="activityFunction">{t('activity.label_function')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('activity.validate_input_function')} id="activityFunction" value={activity.function}
                            required/>
              </div>
              {/* IP */}
              <div className="mb-3">
                <CFormLabel htmlFor="activityIP">{t('activity.label_ip')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('activity.validate_input_ip')} id="activityIP" value={activity.ip}
                            required/>
              </div>
              {/* Agent */}
              <div className="mb-3">
                <CFormLabel htmlFor="activityAgent">{t('activity.label_agent')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('activity.validate_input_agent')} id="activityAgent" value={activity.agent}
                            required/>
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
          <CFormLabel htmlFor="activitySearchName">{t('activity.search')}</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text" id="activitySearchName"
                      placeholder={t('activity.validate_input_subject')} value={activitySearch.name} required/>
        </div>
        <CTable bordered borderColor='primary'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">{t('column_id')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('activity.column_action_name')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('column_action')}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((item, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                <CTableDataCell>{item.subject}</CTableDataCell>
                <CTableDataCell>
                  {/*<Link onClick={() => setVisible(!visible)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;*/}
                  <Link onClick={e => editItem(e, item._id)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;
                  <Link onClick={(e) => {
                    if (window.confirm(t('activity.confirm_delete'))) {
                      deleteItem(event, item._id);
                    }
                  }}><CIcon icon={cilTrash}/></Link>
                </CTableDataCell>
                <CModal visible={visible} onClose={() => {setVisible(false); loadData()}}>
                  <CModalHeader>
                    <CModalTitle>{t('activity.edit')}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CForm noValidate validated={validated} onSubmit={handleSubmit} id={'activityForm'}>
                      {/* Subject */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="activitySubject">{t('activity.label_subject')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('activity.validate_input_subject')} id="activitySubject" value={activity.subject}
                                    required/>
                      </div>
                      {/* Content */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="activityContent">{t('activity.label_content')}</CFormLabel>
                        <CFormTextarea feedbackInvalid={t('activity.validate_input_content')} id="activityContent" rows="3" required
                                       value={activity.content}/>
                      </div>
                      {/* URL */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="activityUrl">{t('activity.label_url')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('activity.validate_input_url')} id="activityUrl" value={activity.url}
                                    required/>
                      </div>
                      {/* Method */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="activityMethod">{t('activity.label_method')}</CFormLabel>
                        <CFormSelect feedbackInvalid={t('product.validate_input_method')} id="activityMethod" value={activity.method} required>
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="DELETE">DELETE</option>
                        </CFormSelect>
                      </div>
                      {/* Function */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="activityFunction">{t('activity.label_function')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('activity.validate_input_function')} id="activityFunction" value={activity.function}
                                    required/>
                      </div>
                      {/* IP */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="activityIP">{t('activity.label_ip')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('activity.validate_input_ip')} id="activityIP" value={activity.ip}
                                    required/>
                      </div>
                      {/* Agent */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="activityAgent">{t('activity.label_agent')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('activity.validate_input_agent')} id="activityAgent" value={activity.agent}
                                    required/>
                      </div>
                    </CForm>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => {setVisible(false);}}>
                      {t('btn_close')}
                    </CButton>
                    <CButton color="primary" type="submit" form={'activityForm'}>
                      {t('btn_save')}
                    </CButton>
                  </CModalFooter>
                </CModal>
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

export default Activity
