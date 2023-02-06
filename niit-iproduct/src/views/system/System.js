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
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormCheck
} from '@coreui/react';
import {
  cilPencil,
  cilTrash
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {create, edit, deleteById} from "../../services/API/System/SystemClient";
import {useTranslation} from "react-i18next";

const url = process.env.REACT_APP_URL;
const system_port = process.env.REACT_APP_PORT_DATABASE_MONGO_SYSTEM_CRUD_DATA;
const system_collection = process.env.REACT_APP_COLLECTION_MONGO_SYSTEM_NAME;
const System = () => {
  const [validated, setValidated] = useState(false);
  const [systemSearch, setSystemSearch] = useState({hits: []});
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
    const data = await axios.get(url + ':' + system_port + '/' + system_collection);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(0);
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
  useEffect(() => {
    const getData = async () => {
      const data = await axios.get(url + ':' + system_port + '/' + system_collection);
      const dataJ = await data.data;
      setSystems(dataJ);
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
    setSystem({
      name: value
    })
  };
  const changeInputSlug = (value) => {
    setSystem({
      slug: value
    })
  };
  const changeInputSearch = async (value) => {
    setSystemSearch({
      name: value
    });
    const data = await axios.get(url + ':' + system_port + '/' + system_collection + '/find?name=' + value);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const changeTextarea = (value) => {
    setSystem({
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
      const system = {
        name: form.systemName.value,
        slug: form.systemSlug.value,
        description: form.systemDescription.value
      };
      console.log(action);
      console.log(system);
      if (action === 'edit') {
        edit(id, system, config);
      } else {
        create(system, config);
      }
    }
    loadData();
  };
  const editItem = (event, id) => {
    setVisible(!visible);
    setId(id);
    setAction('edit');
    axios.get(url + ':' + system_port + '/' + system_collection + '/edit/' + id)
      .then(res => {
        setSystem(res.data);
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
          if (number < Math.ceil(systems.length / systemPerPage))
            setNumber(number + 1)
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
                <CFormInput type="text"
                            feedbackInvalid={t('system.validate_input_type')} id="systemType" value={system.type}
                            required/>
              </div>
              {/* Is Actived */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemIsActived">{t('system.label_is_actived')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_is_actived')} id="systemIsActived" value={system.is_actived}/>
              </div>
              {/* Actived By */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemActivedBy">{t('system.label_actived_by')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_actived_by')} id="systemActivedBy" value={system.actived_by}/>
              </div>
              {/* Actived At */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemActivedAt">{t('system.label_actived_at')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_actived_at')} id="systemActivedAt" value={system.actived_at}/>
              </div>
              {/* Created By */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemCreatedBy">{t('system.label_created_by')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_created_by')} id="systemCreatedBy" value={system.created_by}/>
              </div>
              {/* Created At */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemCreatedAt">{t('system.label_created_at')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_created_at')} id="systemCreatedAt" value={system.created_at}/>
              </div>
              {/* Updated By */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemUpdatedBy">{t('system.label_updated_by')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_updated_by')} id="systemUpdatedBy" value={system.updated_by}/>
              </div>
              {/* Updated At */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemUpdatedAt">{t('system.label_updated_at')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_updated_at')} id="systemUpdatedAt" value={system.updated_at}/>
              </div>
              {/* Is Deleted */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemIsDeleted">{t('system.label_is_deleted')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_is_deleted')} id="systemIsDeleted" value={system.is_deleted}/>
              </div>
              {/* Deleted By */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemDeletedBy">{t('system.label_deleted_by')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_deleted_by')} id="systemDeletedBy" value={system.deleted_by}/>
              </div>
              {/* Deleted At */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemDeletedAt">{t('system.label_deleted_at')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_deleted_at')} id="systemDeletedAt" value={system.deleted_at}/>
              </div>
              {/* Is Published */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemIsPublished">{t('system.label_is_published')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_is_published')} id="systemIsPublished" value={system.is_published}/>
              </div>
              {/* Published By */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemPublishedBy">{t('system.label_published_by')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_published_by')} id="systemPublishedBy" value={system.published_by}/>
              </div>
              {/* Published At */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemPublishedAt">{t('system.label_published_at')}</CFormLabel>&nbsp;&nbsp;
                <CFormCheck feedbackInvalid={t('system.validate_input_published_at')} id="systemPublishedAt" value={system.published_at}/>
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
                      placeholder={t('system.validate_input_type')} value={systemSearch.name} required/>
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
                  <Link onClick={e => editItem(e, item._id)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;
                  <Link onClick={(e) => {
                    if (window.confirm(t('system.confirm_delete'))) {
                      deleteItem(event, item._id);
                    }
                  }}><CIcon icon={cilTrash}/></Link>
                </CTableDataCell>
                <CModal visible={visible} onClose={() => {setVisible(false); loadData()}}>
                  <CModalHeader>
                    <CModalTitle>{t('system.edit')}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CForm noValidate validated={validated} onSubmit={handleSubmit} id={'systemForm'}>
                      {/* Type */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemType">{t('system.label_type')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('system.validate_input_type')} id="systemType" value={system.type}
                                    required/>
                      </div>
                      {/* Is Actived */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemIsActived">{t('system.label_is_actived')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_is_actived')} id="systemIsActived" value={system.is_actived}/>
                      </div>
                      {/* Actived By */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemActivedBy">{t('system.label_actived_by')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_actived_by')} id="systemActivedBy" value={system.actived_by}/>
                      </div>
                      {/* Actived At */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemActivedAt">{t('system.label_actived_at')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_actived_at')} id="systemActivedAt" value={system.actived_at}/>
                      </div>
                      {/* Created By */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemCreatedBy">{t('system.label_created_by')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_created_by')} id="systemCreatedBy" value={system.created_by}/>
                      </div>
                      {/* Created At */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemCreatedAt">{t('system.label_created_at')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_created_at')} id="systemCreatedAt" value={system.created_at}/>
                      </div>
                      {/* Updated By */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemUpdatedBy">{t('system.label_updated_by')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_updated_by')} id="systemUpdatedBy" value={system.updated_by}/>
                      </div>
                      {/* Updated At */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemUpdatedAt">{t('system.label_updated_at')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_updated_at')} id="systemUpdatedAt" value={system.updated_at}/>
                      </div>
                      {/* Is Deleted */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemIsDeleted">{t('system.label_is_deleted')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_is_deleted')} id="systemIsDeleted" value={system.is_deleted}/>
                      </div>
                      {/* Deleted By */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemDeletedBy">{t('system.label_deleted_by')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_deleted_by')} id="systemDeletedBy" value={system.deleted_by}/>
                      </div>
                      {/* Deleted At */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemDeletedAt">{t('system.label_deleted_at')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_deleted_at')} id="systemDeletedAt" value={system.deleted_at}/>
                      </div>
                      {/* Is Published */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemIsPublished">{t('system.label_is_published')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_is_published')} id="systemIsPublished" value={system.is_published}/>
                      </div>
                      {/* Published By */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemPublishedBy">{t('system.label_published_by')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_published_by')} id="systemPublishedBy" value={system.published_by}/>
                      </div>
                      {/* Published At */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemPublishedAt">{t('system.label_published_at')}</CFormLabel>&nbsp;&nbsp;
                        <CFormCheck feedbackInvalid={t('system.validate_input_published_at')} id="systemPublishedAt" value={system.published_at}/>
                      </div>
                    </CForm>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => {setVisible(false);}}>
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
