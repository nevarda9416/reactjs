import { React, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import {
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
  cilZoom,
  cilTrash
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import { create, deleteById } from "../../services/API/Activity/ActivityClient";
import { useTranslation } from "react-i18next";

const url = process.env.REACT_APP_URL;
const activity_port = process.env.REACT_APP_PORT_DATABASE_MONGO_ACTIVITY_CRUD_DATA;
const activity_collection = process.env.REACT_APP_COLLECTION_MONGO_ACTIVITY_NAME;
const Activity = () => {
  const [validated, setValidated] = useState(false);
  const [activitySearch, setActivitySearch] = useState({ hits: [] });
  const [id, setId] = useState(0);
  const [action, setAction] = useState({ hits: [] });
  const [visible, setVisible] = useState(false);
  const LIMIT = process.env.REACT_APP_LIMIT_DATA_RETURN_TABLE;
  const loadData = async () => {
    const data = await axios.get(url + ':' + activity_port + '/' + activity_collection);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(0);
  const [activity, setActivity] = useState([]);
  const [activities, setActivities] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const activityPerPage = LIMIT;
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
  const navigate = useNavigate();
  useEffect(() => {
    const loggedInUser = localStorage.getItem('userLoggedInfo');
    if (loggedInUser) {
      const getData = async () => {
        const data = await axios.get(url + ':' + activity_port + '/' + activity_collection);
        const dataJ = await data.data;
        setActivities(dataJ);
        setData(dataJ);
      };
      getData();
    } else {
      navigate('/login');
    }
  }, [load]);
  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    setActivity({
      ...activity,
      [name]: value
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
        const activity = {
          subject: form.activitySubject.value,
          content: form.activityContent.value,
          url: form.activityUrl.value,
          method: form.activityMethod.value,
          function: form.activityFunction.value,
          ip: form.activityIP.value,
          agent: form.activityAgent.value,
          user_id: foundUser.id,
          system_type: 'log' // Chưa dùng
        };
        console.log(action);
        console.log(activity);
        if (action === 'edit') {
          //edit(id, activity, config); // Activity not need edit
        } else {
          create(activity, config);
        }
        loadData();
      }
    }
  };
  const viewItem = (id) => {
    setVisible(!visible);
    setId(id);
    setAction('edit');
    axios.get(url + ':' + activity_port + '/' + activity_collection + '/edit/' + id)
      .then(res => {
        setActivity(res.data);
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
      const activity = {
        user_id: foundUser.id
      };
      deleteById(id, activity, config);
      alert(t('activity.alert_delete_success'));
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
          if (number < Math.ceil(activities.length / activityPerPage))
            setNumber(number + 1)
          else
            setNumber(Math.ceil(activities.length / activityPerPage))
        }}>
        {t('paginate_next')}
      </button>
      <button
        className="px-3 py-1 m-1 text-center btn btn-primary"
        onClick={() => {
          setNumber(Math.ceil(activities.length / activityPerPage))
        }}>
        {t('paginate_last')}
      </button>
    </div>
    ;
  return (
    <CRow>
      <CCol xs={12}>
        <div className="mb-3">
          <CFormLabel htmlFor="activitySearchName">{t('activity.search')}</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text" id="activitySearchName"
            placeholder={t('activity.validate_input_subject')} value={activitySearch.name} required />
        </div>
        {pagination}
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
                  <Link onClick={() => viewItem(item._id)}><CIcon icon={cilZoom} /></Link>&nbsp;&nbsp;
                  <Link onClick={() => {
                    if (window.confirm(t('activity.confirm_delete'))) {
                      deleteItem(item._id);
                    }
                  }}><CIcon icon={cilTrash} /></Link>
                </CTableDataCell>
                <CModal size="lg" visible={visible} onClose={() => { setVisible(false); loadData() }}>
                  <CModalHeader>
                    <CModalTitle>{t('activity.show')}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CForm noValidate validated={validated} onSubmit={handleSubmit} id={'activityForm'}>
                      {/* Subject */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="activitySubject">{t('activity.label_subject')}</CFormLabel>
                        <CFormInput type="text" onChange={handleChange}
                          feedbackInvalid={t('activity.validate_input_subject')} id="activitySubject" name="subject" value={activity.subject || ''}
                          required />
                      </div>
                      {/* Content */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="activityContent">{t('activity.label_content')}</CFormLabel>
                        <CFormTextarea feedbackInvalid={t('activity.validate_input_content')} id="activityContent" name="content" rows="3" required
                          value={activity.content || ''} onChange={handleChange} />
                      </div>
                      {/* URL */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="activityUrl">{t('activity.label_url')}</CFormLabel>
                        <CFormInput type="text" onChange={handleChange}
                          feedbackInvalid={t('activity.validate_input_url')} id="activityUrl" name="url" value={activity.url || ''}
                          required />
                      </div>
                      {/* Method */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="activityMethod">{t('activity.label_method')}</CFormLabel>
                        <CFormSelect feedbackInvalid={t('product.validate_input_method')} id="activityMethod" name="method" value={activity.method || ''} required onChange={handleChange}>
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="DELETE">DELETE</option>
                        </CFormSelect>
                      </div>
                      {/* Function */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="activityFunction">{t('activity.label_function')}</CFormLabel>
                        <CFormInput type="text" onChange={handleChange}
                          feedbackInvalid={t('activity.validate_input_function')} id="activityFunction" name="function" value={activity.function || ''}
                          required />
                      </div>
                      {/* IP */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="activityIP">{t('activity.label_ip')}</CFormLabel>
                        <CFormInput type="text" onChange={handleChange}
                          feedbackInvalid={t('activity.validate_input_ip')} id="activityIP" name="ip" value={activity.ip || ''}
                          required />
                      </div>
                      {/* Agent */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="activityAgent">{t('activity.label_agent')}</CFormLabel>
                        <CFormInput type="text" onChange={handleChange}
                          feedbackInvalid={t('activity.validate_input_agent')} id="activityAgent" name="agent" value={activity.agent || ''}
                          required />
                      </div>
                    </CForm>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => { setVisible(false); }}>
                      {t('btn_close')}
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

export default Activity
