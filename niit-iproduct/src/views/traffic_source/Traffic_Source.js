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
  cilZoom,
  cilTrash
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {create, edit, deleteById} from "../../services/API/TrafficSource/TrafficSourceClient";

const url = process.env.REACT_APP_URL;
const trafficSource_port = process.env.REACT_APP_PORT_DATABASE_MONGO_TRAFFIC_SOURCE_CRUD_DATA;
const trafficSource_collection = process.env.REACT_APP_COLLECTION_MONGO_TRAFFIC_SOURCE_NAME;
const Traffic_Source = () => {
  const [validated, setValidated] = useState(false);
  const [trafficSourceSearch, setTrafficSourceSearch] = useState({hits: []});
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
    const data = await axios.get(url + ':' + trafficSource_port + '/' + trafficSource_collection);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(0);
  const [trafficSource, setTrafficSource] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const trafficSourcePerPage = LIMIT;
  const lastTrafficSource = number * trafficSourcePerPage;
  const firstTrafficSource = lastTrafficSource - trafficSourcePerPage;
  const currentData = data.slice(firstTrafficSource, lastTrafficSource);
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(trafficSource.length / trafficSourcePerPage); i++) {
    pageNumber.push(i);
  }
  const changePage = (pageNumber) => {
    setNumber(pageNumber);
  };
  useEffect(() => {
    const getData = async () => {
      const data = await axios.get(url + ':' + trafficSource_port + '/' + trafficSource_collection);
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
    setTrafficSource({
      name: value
    })
  };
  const changeInputSlug = (value) => {
    setTrafficSource({
      slug: value
    })
  };
  const changeInputSearch = async (value) => {
    setTrafficSourceSearch({
      name: value
    });
    const data = await axios.get(url + ':' + trafficSource_port + '/' + trafficSource_collection + '/find?name=' + value);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const changeTextarea = (value) => {
    setTrafficSource({
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
      const trafficSource = {
        name: form.trafficSourceName.value,
        slug: form.trafficSourceSlug.value,
        description: form.trafficSourceDescription.value
      };
      console.log(action);
      console.log(trafficSource);
      if (action === 'edit') {
        edit(id, trafficSource, config);
      } else {
        create(trafficSource, config);
      }
    }
    loadData();
  };
  const viewItem = (event, id) => {
    setVisible(!visible);
    setId(id);
    setAction('edit');
    axios.get(url + ':' + trafficSource_port + '/' + trafficSource_collection + '/edit/' + id)
      .then(res => {
        setTrafficSource(res.data);
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
          <CFormLabel htmlFor="trafficSourceSearchName">{t('traffic_source.search')}</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text" id="trafficSourceSearchName"
                      placeholder={t('traffic_source.validate_input_source')} value={trafficSourceSearch.name} required/>
        </div>
        <CTable bordered borderColor='primary'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">{t('column_id')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('traffic_source.column_source')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('column_action')}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((item, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                <CTableDataCell>{item.register_source}</CTableDataCell>
                <CTableDataCell>
                  {/*<Link onClick={() => setVisible(!visible)}><CIcon icon={cilZoom}/></Link>&nbsp;&nbsp;*/}
                  <Link onClick={e => viewItem(e, item._id)}><CIcon icon={cilZoom}/></Link>&nbsp;&nbsp;
                </CTableDataCell>
                <CModal visible={visible} onClose={() => {setVisible(false); loadData()}}>
                  <CModalHeader>
                    <CModalTitle>{t('traffic_source.view')}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CForm noValidate validated={validated} onSubmit={handleSubmit} id={'trafficSourceForm'}>
                      {/* Register Source */}
                      <div className="mb-3">
                        <strong>{t('traffic_source.label_register_source')}:</strong>&nbsp;&nbsp;
                        {trafficSource.register_source}
                      </div>
                      {/* Source ID */}
                      <div className="mb-3">
                        <strong>{t('traffic_source.label_source_id')}:</strong>&nbsp;&nbsp;
                        {trafficSource.source_id}
                      </div>
                      {/* Customer ID */}
                      <div className="mb-3">
                        <strong>{t('traffic_source.label_customer_id')}:</strong>&nbsp;&nbsp;
                        {trafficSource.customer_id}
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

export default Traffic_Source
