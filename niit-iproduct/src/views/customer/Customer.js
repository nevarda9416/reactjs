import {React, useEffect, useState} from 'react'
import {Link} from 'react-router-dom';

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormSelect,
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
import {create, edit, deleteById} from "../../services/API/Customer/CustomerClient";
import {useTranslation} from "react-i18next";

const url = process.env.REACT_APP_URL;
const traffic_source_port = process.env.REACT_APP_PORT_DATABASE_MONGO_TRAFFIC_SOURCE_CRUD_DATA;
const traffic_source_collection = process.env.REACT_APP_COLLECTION_MONGO_TRAFFIC_SOURCE_NAME;
const customer_port = process.env.REACT_APP_PORT_DATABASE_MONGO_CUSTOMER_CRUD_DATA;
const customer_collection = process.env.REACT_APP_COLLECTION_MONGO_CUSTOMER_NAME;
const Customer = () => {
  const [validated, setValidated] = useState(false);
  const [customerSearch, setCustomerSearch] = useState({hits: []});
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
    const data = await axios.get(url + ':' + customer_port + '/' + customer_collection);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(0);
  const [traffic_sources, setTrafficSources] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const [customerPerPage] = LIMIT;
  const lastCustomer = number * customerPerPage;
  const firstCustomer = lastCustomer - customerPerPage;
  const currentData = data.slice(firstCustomer, lastCustomer);
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(customer.length / customerPerPage); i++) {
    pageNumber.push(i);
  }
  const changePage = (pageNumber) => {
    setNumber(pageNumber);
  };
  useEffect(() => {
    const getData = async () => {
      const dataT = await axios.get(url + ':' + traffic_source_port + '/' + traffic_source_collection);
      const dataJT = await dataT.data;
      setTrafficSources(dataJT);
      const data = await axios.get(url + ':' + customer_port + '/' + customer_collection);
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
    setCustomer({
      name: value
    })
  };
  const changeInputSlug = (value) => {
    setCustomer({
      slug: value
    })
  };
  const changeInputSearch = async (value) => {
    setCustomerSearch({
      name: value
    });
    const data = await axios.get(url + ':' + customer_port + '/' + customer_collection + '/find?name=' + value);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const changeTextarea = (value) => {
    setCustomer({
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
      const customer = {
        name: form.customerName.value,
        slug: form.customerSlug.value,
        description: form.customerDescription.value
      };
      console.log(action);
      console.log(customer);
      if (action === 'edit') {
        edit(id, customer, config);
      } else {
        create(customer, config);
      }
    }
    loadData();
  };
  const editItem = (event, id) => {
    setVisible(!visible);
    setId(id);
    setAction('edit');
    axios.get(url + ':' + customer_port + '/' + customer_collection + '/edit/' + id)
      .then(res => {
        setCustomer(res.data);
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
            <strong>{t('customer.add')}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-3">
                <CFormLabel htmlFor="customerUsername">{t('customer.label_username')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('customer.validate_input_username')} id="customerUsername" value={customer.username}
                            required/>
              </div>
              {/* Email */}
              <div className="mb-3">
                <CFormLabel htmlFor="customerEmail">{t('customer.label_email')}</CFormLabel>
                <CFormInput type="email"
                            feedbackInvalid={t('customer.validate_input_email')} id="customerEmail" value={customer.email}
                            required/>
              </div>
              {/* Telephone */}
              <div className="mb-3">
                <CFormLabel htmlFor="customerTelephone">{t('customer.label_telephone')}</CFormLabel>
                <CFormInput type="number"
                            feedbackInvalid={t('customer.validate_input_telephone')} id="customerTelephone" value={customer.telephone}
                            required/>
              </div>
              {/* Full Name */}
              <div className="mb-3">
                <CFormLabel htmlFor="customerFullname">{t('customer.label_fullname')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('customer.validate_input_fullname')} id="customerFullname" value={customer.fullname}
                            required/>
              </div>
              {/* Password */}
              <div className="mb-3">
                <CFormLabel htmlFor="customerPassword">{t('customer.label_password')}</CFormLabel>
                <CFormInput type="password"
                            feedbackInvalid={t('customer.validate_input_password')} id="customerPassword" value={customer.password}
                            required/>
              </div>
              {/* Gender */}
              <div className="mb-3">
                <CFormLabel htmlFor="customerGender">{t('customer.label_gender')}</CFormLabel>
                <CFormSelect feedbackInvalid={t('customer.validate_input_gender')} id="customerGender" value={customer.gender} required>
                  <option value="1">Nam</option>
                  <option value="0">Nữ</option>
                  <option value="-1">Không xác định</option>
                </CFormSelect>
              </div>
              {/* Date of birth */}
              <div className="mb-3">
                <CFormLabel htmlFor="customerDateOfBirth">{t('customer.label_date_of_birth')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('customer.validate_input_date_of_birth')} id="customerDateOfBirth" value={customer.date_of_birth}
                            required/>
              </div>
              {/* Status */}
              <div className="mb-3">
                <CFormLabel htmlFor="customerStatus">{t('customer.label_status')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('customer.validate_input_status')} id="customerStatus" value={customer.status}
                            required/>
              </div>
              {/* Traffic Id */}
              <div className="mb-3">
                <CFormLabel htmlFor="customerTrafficId">{t('customer.label_traffic_id')}</CFormLabel>
                <CFormSelect feedbackInvalid={t('customer.validate_input_traffic_id')} id="customerTrafficId" value={customer.traffic_id} required>
                  <option></option>
                  {
                  traffic_sources.map((item, index) => (
                    <option key={index} value={item._id}>{item.register_source}</option>
                  ))
                  }
                </CFormSelect>
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
          <CFormLabel htmlFor="customerSearchName">{t('customer.search')}</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text" id="customerSearchName"
                      placeholder={t('customer.validate_input_username')} value={customerSearch.name} required/>
        </div>
        <CTable bordered borderColor='primary'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">{t('column_id')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('customer.column_username')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('column_action')}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((item, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                <CTableDataCell>{item.fullname}</CTableDataCell>
                <CTableDataCell>
                  {/*<Link onClick={() => setVisible(!visible)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;*/}
                  <Link onClick={e => editItem(e, item._id)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;
                  <Link onClick={(e) => {
                    if (window.confirm('Delete this customer?')) {
                      deleteItem(event, item._id);
                    }
                  }}><CIcon icon={cilTrash}/></Link>
                </CTableDataCell>
                <CModal visible={visible} onClose={() => {setVisible(false); loadData()}}>
                  <CModalHeader>
                    <CModalTitle>{t('customer.edit')}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CForm noValidate validated={validated} onSubmit={handleSubmit} id={'customerForm'}>
                      {/* Username */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="customerUsername">{t('customer.label_username')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('customer.validate_input_username')} id="customerUsername" value={customer.username}
                                    required/>
                      </div>
                      {/* Email */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="customerEmail">{t('customer.label_email')}</CFormLabel>
                        <CFormInput type="email"
                                    feedbackInvalid={t('customer.validate_input_email')} id="customerEmail" value={customer.email}
                                    required/>
                      </div>
                      {/* Telephone */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="customerTelephone">{t('customer.label_telephone')}</CFormLabel>
                        <CFormInput type="number"
                                    feedbackInvalid={t('customer.validate_input_telephone')} id="customerTelephone" value={customer.telephone}
                                    required/>
                      </div>
                      {/* Full Name */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="customerFullname">{t('customer.label_fullname')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('customer.validate_input_fullname')} id="customerFullname" value={customer.fullname}
                                    required/>
                      </div>
                      {/* Password */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="customerPassword">{t('customer.label_password')}</CFormLabel>
                        <CFormInput type="password"
                                    feedbackInvalid={t('customer.validate_input_password')} id="customerPassword" value={customer.password}
                                    required/>
                      </div>
                      {/* Gender */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="customerGender">{t('customer.label_gender')}</CFormLabel>
                        <CFormSelect feedbackInvalid={t('customer.validate_input_gender')} id="customerGender" value={customer.gender} required>
                          <option value="1">Nam</option>
                          <option value="0">Nữ</option>
                          <option value="-1">Không xác định</option>
                        </CFormSelect>
                      </div>
                      {/* Date of birth */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="customerDateOfBirth">{t('customer.label_date_of_birth')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('customer.validate_input_date_of_birth')} id="customerDateOfBirth" value={customer.date_of_birth}
                                    required/>
                      </div>
                      {/* Status */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="customerStatus">{t('customer.label_status')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('customer.validate_input_status')} id="customerStatus" value={customer.status}
                                    required/>
                      </div>
                      {/* Traffic Id */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="customerTrafficId">{t('customer.label_traffic_id')}</CFormLabel>
                        <CFormSelect feedbackInvalid={t('customer.validate_input_traffic_id')} id="customerTrafficId" value={customer.traffic_id} required>
                          <option></option>
                          {
                          traffic_sources.map((item, index) => (
                            <option key={index} value={item._id}>{item.register_source}</option>
                          ))
                          }
                        </CFormSelect>
                      </div>
                    </CForm>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => {setVisible(false);}}>
                      {t('btn_close')}
                    </CButton>
                    <CButton color="primary" type="submit" form={'customerForm'}>
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

export default Customer
