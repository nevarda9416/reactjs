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
  cilZoom
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {create, edit, deleteById} from "../../services/API/Tracking/TrackingClient";

const url = process.env.REACT_APP_URL;
const tracking_port = process.env.REACT_APP_PORT_DATABASE_MONGO_TRACKING_CRUD_DATA;
const tracking_collection = process.env.REACT_APP_COLLECTION_MONGO_TRACKING_NAME;
const Tracking = () => {
  const [validated, setValidated] = useState(false);
  const [trackingSearch, setTrackingSearch] = useState({hits: []});
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
    const data = await axios.get(url + ':' + tracking_port + '/' + tracking_collection);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(0);
  const [tracking, setTracking] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const [trackingPerPage] = LIMIT;
  const lastTracking = number * trackingPerPage;
  const firstTracking = lastTracking - trackingPerPage;
  const currentData = data.slice(firstTracking, lastTracking);
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(tracking.length / trackingPerPage); i++) {
    pageNumber.push(i);
  }
  const changePage = (pageNumber) => {
    setNumber(pageNumber);
  };
  useEffect(() => {
    const getData = async () => {
      const data = await axios.get(url + ':' + tracking_port + '/' + tracking_collection);
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
    setTracking({
      name: value
    })
  };
  const changeInputSlug = (value) => {
    setTracking({
      slug: value
    })
  };
  const changeInputSearch = async (value) => {
    setTrackingSearch({
      name: value
    });
    const data = await axios.get(url + ':' + tracking_port + '/' + tracking_collection + '/find?name=' + value);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const changeTextarea = (value) => {
    setTracking({
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
      const tracking = {
        name: form.trackingName.value,
        slug: form.trackingSlug.value,
        description: form.trackingDescription.value
      };
      console.log(action);
      console.log(tracking);
      if (action === 'edit') {
        edit(id, tracking, config);
      } else {
        create(tracking, config);
      }
    }
    loadData();
  };
  const viewItem = (event, id) => {
    setVisible(!visible);
    setId(id);
    setAction('edit');
    axios.get(url + ':' + tracking_port + '/' + tracking_collection + '/edit/' + id)
      .then(res => {
        setTracking(res.data);
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
      <CCol xs={12}>
        <div className="mb-3">
          <CFormLabel htmlFor="trackingSearchName">{t('tracking.search')}</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text" id="trackingSearchName"
                      placeholder={t('tracking.validate_input_keyword')} value={trackingSearch.name} required/>
        </div>
        <CTable bordered borderColor='primary'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">{t('column_id')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('tracking.column_keyword')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('column_action')}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((item, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                <CTableDataCell>{item.keyword}</CTableDataCell>
                <CTableDataCell>
                  {/*<Link onClick={() => setVisible(!visible)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;*/}
                  <Link onClick={e => viewItem(e, item._id)}><CIcon icon={cilZoom}/></Link>&nbsp;&nbsp;
                </CTableDataCell>
                <CModal visible={visible} onClose={() => {setVisible(false); loadData()}}>
                  <CModalHeader>
                    <CModalTitle>{t('tracking.view')} ID: {tracking._id}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CForm noValidate validated={validated} onSubmit={handleSubmit} id={'trackingForm'}>
                      {/* Customer ID */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_customer_id')}:</strong>&nbsp;&nbsp;
                        {tracking.customer_id}
                      </div>
                      {/* Datetime */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_datetime')}:</strong>&nbsp;&nbsp;
                        {tracking.datetime}
                      </div>
                      {/* Keyword */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_keyword')}:</strong>&nbsp;&nbsp;
                        {tracking.keyword}
                      </div>
                      {/* Action */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_action')}:</strong>&nbsp;&nbsp;
                        {tracking.action}
                      </div>
                      {/* User Agent */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_user_agent')}:</strong>&nbsp;&nbsp;
                        {tracking.user_agent}
                      </div>
                      {/* Http Referrer */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_http_referrer')}:</strong>&nbsp;&nbsp;
                        {tracking.http_referrer}
                      </div>
                      {/* IP */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_ip')}:</strong>&nbsp;&nbsp;
                        {tracking.ip}
                      </div>
                      {/* Network ID */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_network_id')}:</strong>&nbsp;&nbsp;
                        {tracking.network_id}
                      </div>
                      {/* OS */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_os')}:</strong>&nbsp;&nbsp;
                        {tracking.os}
                      </div>
                      {/* Browser */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_browser')}:</strong>&nbsp;&nbsp;
                        {tracking.browser}
                      </div>
                      {/* Browser Version */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_browser_version')}:</strong>&nbsp;&nbsp;
                        {tracking.browser_version}
                      </div>
                      {/* Device Type */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_device_type')}:</strong>&nbsp;&nbsp;
                        {tracking.device_type}
                      </div>
                      {/* Source */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_source')}:</strong>&nbsp;&nbsp;
                        {tracking.source}
                      </div>
                      {/* Redirect to Url */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_redirect_to_url')}:</strong>&nbsp;&nbsp;
                        {tracking.redirect_to_url}
                      </div>
                      {/* Http Accept Language */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_http_accept_language')}:</strong>&nbsp;&nbsp;
                        {tracking.http_accept_language}
                      </div>
                      {/* Http Accept Encoding */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_http_accept_encoding')}:</strong>&nbsp;&nbsp;
                        {tracking.http_accept_encoding}
                      </div>
                      {/* Http Accept */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_http_accept')}:</strong>&nbsp;&nbsp;
                        {tracking.http_accept}
                      </div>
                      {/* Http Host */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_http_host')}:</strong>&nbsp;&nbsp;
                        {tracking.http_host}
                      </div>
                      {/* Server Address */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_server_address')}:</strong>&nbsp;&nbsp;
                        {tracking.server_address}
                      </div>
                      {/* Country */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_country')}:</strong>&nbsp;&nbsp;
                        {tracking.country}
                      </div>
                      {/* City */}
                      <div className="mb-3">
                        <strong>{t('tracking.label_city')}:</strong>&nbsp;&nbsp;
                        {tracking.city}
                      </div>
                    </CForm>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => {setVisible(false);}}>
                      {t('btn_close')}
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

export default Tracking
