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
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormCheck
} from '@coreui/react';
import {
  cilPencil,
  cilTrash
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import { create, edit, deleteById } from "../../services/API/System/SystemClient";
import { useTranslation } from "react-i18next";

const url = process.env.REACT_APP_URL;
const system_port = process.env.REACT_APP_PORT_DATABASE_MONGO_SYSTEM_CRUD_DATA;
const system_collection = process.env.REACT_APP_COLLECTION_MONGO_SYSTEM_NAME;
const System = () => {
  const [validated, setValidated] = useState(false);
  const [systemSearch, setSystemSearch] = useState({ hits: [] });
  const [id, setId] = useState(0);
  const [action, setAction] = useState({ hits: [] });
  const [visible, setVisible] = useState(false);
  const LIMIT = process.env.REACT_APP_LIMIT_DATA_RETURN_TABLE;
  const loadData = async () => {
    const data = await axios.get(url + ':' + system_port + '/' + system_collection);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const [data, setData] = useState([]);
  const [system, setSystem] = useState([]);
  const [systems, setSystems] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const systemPerPage = LIMIT;
  const lastSystem = number * systemPerPage;
  const firstSystem = lastSystem - systemPerPage;
  const currentData = data.slice(firstSystem, lastSystem);
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(system.length / systemPerPage); i++) {
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
        const data = await axios.get(url + ':' + system_port + '/' + system_collection);
        const dataJ = await data.data;
        setSystems(dataJ);
        setData(dataJ);
      };
      getData();
    } else {
      navigate('/login');
    }
  }, []);
  const changeInputSearch = async (value) => {
    setSystemSearch({
      name: value
    });
    const data = await axios.get(url + ':' + system_port + '/' + system_collection + '/find?name=' + value);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    setSystem({
      ...system,
      [name]: value
    })
  };
  const handleCheck = (e) => {
    const target = e.target;
    const name = target.name;
    setSystem({
      ...system,
      [name]: target.checked === true ? 1 : 0
    });
    console.log(target.checked);
  };
  const handleSubmit = (event) => {
    const form = event.target;
    console.log(form);
    if (form.checkValidity() === false) {
      console.log('inValid');
      setValidated(true);
    } else {
      console.log('valid');
      setValidated(false);
      const loggedInUser = localStorage.getItem('userLoggedInfo');
      if (loggedInUser) {
        const foundUser = JSON.parse(loggedInUser);
        const config = {
          headers: { Authorization: `Bearer ${foundUser.token}` }
        };
        const system = {
          type: form.systemType.value,
          is_actived: form.systemIsActived.checked === true ? 1 : 0,
          actived_by: form.systemActivedBy.checked === true ? 1 : 0,
          actived_at: form.systemActivedAt.checked === true ? 1 : 0,
          created_by: form.systemCreatedBy.checked === true ? 1 : 0,
          created_at: form.systemCreatedAt.checked === true ? 1 : 0,
          updated_by: form.systemUpdatedBy.checked === true ? 1 : 0,
          updated_at: form.systemUpdatedAt.checked === true ? 1 : 0,
          is_deleted: form.systemIsDeleted.checked === true ? 1 : 0,
          deleted_by: form.systemDeletedBy.checked === true ? 1 : 0,
          deleted_at: form.systemDeletedAt.checked === true ? 1 : 0,
          is_published: form.systemIsPublished.checked === true ? 1 : 0,
          published_by: form.systemPublishedBy.checked === true ? 1 : 0,
          published_at: form.systemPublishedAt.checked === true ? 1 : 0,
          user_id: foundUser.id
        };
        console.log(action);
        console.log(system);
        if (action === 'edit') {
          edit(id, system, config);
          alert(t('system.alert_edit_success'));
        } else {
          create(system, config);
          // Reset form input data
          form.systemType.value = '';
          form.systemIsActived.checked = false;
          form.systemActivedBy.checked = false;
          form.systemActivedAt.checked = false;
          form.systemCreatedBy.checked = false;
          form.systemCreatedAt.checked = false;
          form.systemUpdatedBy.checked = false;
          form.systemUpdatedAt.checked = false;
          form.systemIsDeleted.checked = false;
          form.systemDeletedBy.checked = false;
          form.systemDeletedAt.checked = false;
          form.systemIsPublished.checked = false;
          form.systemPublishedBy.checked = false;
          form.systemPublishedAt.checked = false;
          alert(t('system.alert_create_success'));
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
    axios.get(url + ':' + system_port + '/' + system_collection + '/edit/' + id)
      .then(res => {
        setSystem(res.data);
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
      alert(t('system.alert_delete_success'));
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
            setNumber(number - 1);
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
          if (number < Math.ceil(systems.length / systemPerPage))
            setNumber(number + 1);
          else
            setNumber(Math.ceil(systems.length / systemPerPage))
        }}>
        {t('paginate_next')}
      </button>
      <button
        className="px-3 py-1 m-1 text-center btn btn-primary"
        onClick={() => {
          setNumber(Math.ceil(systems.length / systemPerPage))
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
            <strong>{t('system.add_or_edit')}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              {/* Type */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemType">{t('system.label_type')}</CFormLabel>
                <CFormInput type="text" onChange={handleChange}
                  feedbackInvalid={t('system.validate_input_type')} id="systemType" name="type"
                  required />
              </div>
              {/* Is Actived */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemIsActived">{t('system.label_is_actived')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_is_actived')} id="systemIsActived"
                  name="is_actived" onChange={handleCheck}
                  defaultChecked={system.is_actived === 1 ? true : false} />
              </div>
              {/* Actived By */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemActivedBy">{t('system.label_actived_by')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_actived_by')} id="systemActivedBy"
                  name="actived_by" onChange={handleCheck}
                  defaultChecked={system.actived_by === 1 ? true : false} />
              </div>
              {/* Actived At */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemActivedAt">{t('system.label_actived_at')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_actived_at')} id="systemActivedAt"
                  name="actived_at" onChange={handleCheck}
                  defaultChecked={system.actived_at === 1 ? true : false} />
              </div>
              {/* Created By */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemCreatedBy">{t('system.label_created_by')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_created_by')} id="systemCreatedBy"
                  name="created_by" onChange={handleCheck}
                  defaultChecked={system.created_by === 1 ? true : false} />
              </div>
              {/* Created At */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemCreatedAt">{t('system.label_created_at')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_created_at')} id="systemCreatedAt"
                  name="created_at" onChange={handleCheck}
                  defaultChecked={system.created_at === 1 ? true : false} />
              </div>
              {/* Updated By */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemUpdatedBy">{t('system.label_updated_by')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_updated_by')} id="systemUpdatedBy"
                  name="updated_by" onChange={handleCheck}
                  defaultChecked={system.updated_by === 1 ? true : false} />
              </div>
              {/* Updated At */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemUpdatedAt">{t('system.label_updated_at')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_updated_at')} id="systemUpdatedAt"
                  name="updated_at" onChange={handleCheck}
                  defaultChecked={system.updated_at === 1 ? true : false} />
              </div>
              {/* Is Deleted */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemIsDeleted">{t('system.label_is_deleted')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_is_deleted')} id="systemIsDeleted"
                  name="is_deleted" onChange={handleCheck}
                  defaultChecked={system.is_deleted === 1 ? true : false} />
              </div>
              {/* Deleted By */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemDeletedBy">{t('system.label_deleted_by')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_deleted_by')} id="systemDeletedBy"
                  name="deleted_by" onChange={handleCheck}
                  defaultChecked={system.deleted_by === 1 ? true : false} />
              </div>
              {/* Deleted At */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemDeletedAt">{t('system.label_deleted_at')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_deleted_at')} id="systemDeletedAt"
                  name="deleted_at" onChange={handleCheck}
                  defaultChecked={system.deleted_at === 1 ? true : false} />
              </div>
              {/* Is Published */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemIsPublished">{t('system.label_is_published')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_is_published')} id="systemIsPublished"
                  name="is_published" onChange={handleCheck}
                  defaultChecked={system.is_published === 1 ? true : false} />
              </div>
              {/* Published By */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemPublishedBy">{t('system.label_published_by')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_published_by')} id="systemPublishedBy"
                  name="published_by" onChange={handleCheck}
                  defaultChecked={system.published_by === 1 ? true : false} />
              </div>
              {/* Published At */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemPublishedAt">{t('system.label_published_at')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_published_at')} id="systemPublishedAt"
                  name="published_at" onChange={handleCheck}
                  defaultChecked={system.published_at === 1 ? true : false} />
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
          <CFormLabel htmlFor="systemSearchName">{t('system.search')}</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text" id="systemSearchName"
            placeholder={t('system.validate_input_type')} value={systemSearch.name} required />
        </div>
        {pagination}
        <CTable bordered borderColor='primary'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">{t('column_id')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('system.column_type')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('column_action')}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((item, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                <CTableDataCell>{item.type}</CTableDataCell>
                <CTableDataCell>
                  {/*<Link onClick={() => setVisible(!visible)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;*/}
                  <Link onClick={e => editItem(item._id)}><CIcon icon={cilPencil} /></Link>&nbsp;&nbsp;
                  <Link onClick={(e) => {
                    if (window.confirm(t('system.confirm_delete'))) {
                      deleteItem(item._id);
                    }
                  }}><CIcon icon={cilTrash} /></Link>
                </CTableDataCell>
                <CModal visible={visible} onClose={() => {
                  setVisible(false);
                  loadData()
                }}>
                  <CModalHeader>
                    <CModalTitle>{t('system.edit')}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CForm noValidate validated={validated} onSubmit={handleSubmit} id={'systemForm'}>
                      {/* Type */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemType">{t('system.label_type')}</CFormLabel>
                        <CFormInput type="text" onChange={handleChange}
                          feedbackInvalid={t('system.validate_input_type')} id="systemType" name="type"
                          value={system.type || ''}
                          required />
                      </div>
                      {/* Is Actived */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemIsActived">{t('system.label_is_actived')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_is_actived')} id="systemIsActived"
                          name="is_actived" value={system.is_actived || 1} onChange={handleCheck}
                          defaultChecked={system.is_actived === 1 ? true : false} />
                      </div>
                      {/* Actived By */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemActivedBy">{t('system.label_actived_by')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_actived_by')} id="systemActivedBy"
                          name="actived_by" value={system.actived_by || 1} onChange={handleCheck}
                          defaultChecked={system.actived_by === 1 ? true : false} />
                      </div>
                      {/* Actived At */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemActivedAt">{t('system.label_actived_at')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_actived_at')} id="systemActivedAt"
                          name="actived_at" value={system.actived_at || 1} onChange={handleCheck}
                          defaultChecked={system.actived_at === 1 ? true : false} />
                      </div>
                      {/* Created By */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemCreatedBy">{t('system.label_created_by')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_created_by')} id="systemCreatedBy"
                          name="created_by" value={system.created_by || 1} onChange={handleCheck}
                          defaultChecked={system.created_by === 1 ? true : false} />
                      </div>
                      {/* Created At */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemCreatedAt">{t('system.label_created_at')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_created_at')} id="systemCreatedAt"
                          name="created_at" value={system.created_at || 1} onChange={handleCheck}
                          defaultChecked={system.created_at === 1 ? true : false} />
                      </div>
                      {/* Updated By */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemUpdatedBy">{t('system.label_updated_by')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_updated_by')} id="systemUpdatedBy"
                          name="updated_by" value={system.updated_by || 1} onChange={handleCheck}
                          defaultChecked={system.updated_by === 1 ? true : false} />
                      </div>
                      {/* Updated At */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemUpdatedAt">{t('system.label_updated_at')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_updated_at')} id="systemUpdatedAt"
                          name="updated_at" value={system.updated_at || 1} onChange={handleCheck}
                          defaultChecked={system.updated_at === 1 ? true : false} />
                      </div>
                      {/* Is Deleted */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemIsDeleted">{t('system.label_is_deleted')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_is_deleted')} id="systemIsDeleted"
                          name="is_deleted" value={system.is_deleted || 1} onChange={handleCheck}
                          defaultChecked={system.is_deleted === 1 ? true : false} />
                      </div>
                      {/* Deleted By */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemDeletedBy">{t('system.label_deleted_by')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_deleted_by')} id="systemDeletedBy"
                          name="deleted_by" value={system.deleted_by || 1} onChange={handleCheck}
                          defaultChecked={system.deleted_by === 1 ? true : false} />
                      </div>
                      {/* Deleted At */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemDeletedAt">{t('system.label_deleted_at')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_deleted_at')} id="systemDeletedAt"
                          name="deleted_at" value={system.deleted_at || 1} onChange={handleCheck}
                          defaultChecked={system.deleted_at === 1 ? true : false} />
                      </div>
                      {/* Is Published */}
                      <div className="mb-3">
                        <CFormLabel
                          htmlFor="systemIsPublished">{t('system.label_is_published')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_is_published')} id="systemIsPublished"
                          name="is_published" value={system.is_published || 1} onChange={handleCheck}
                          defaultChecked={system.is_published === 1 ? true : false} />
                      </div>
                      {/* Published By */}
                      <div className="mb-3">
                        <CFormLabel
                          htmlFor="systemPublishedBy">{t('system.label_published_by')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_published_by')} id="systemPublishedBy"
                          name="published_by" value={system.published_by || 1} onChange={handleCheck}
                          defaultChecked={system.published_by === 1 ? true : false} />
                      </div>
                      {/* Published At */}
                      <div className="mb-3">
                        <CFormLabel
                          htmlFor="systemPublishedAt">{t('system.label_published_at')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_published_at')} id="systemPublishedAt"
                          name="published_at" value={system.published_at || 1} onChange={handleCheck}
                          defaultChecked={system.published_at === 1 ? true : false} />
                      </div>
                    </CForm>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => {
                      setVisible(false);
                    }}>
                      {t('btn_close')}
                    </CButton>
                    <CButton color="primary" type="submit" form={'systemForm'}>
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

export default System
