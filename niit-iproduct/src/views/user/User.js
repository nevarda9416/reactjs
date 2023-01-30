import {useEffect, useState} from 'react'
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
import {create, edit, deleteById} from "../../services/API/User/UserClient";
import {useTranslation} from "react-i18next";

const url = process.env.REACT_APP_URL;
const user_port = process.env.REACT_APP_PORT_DATABASE_MONGO_USER_CRUD_DATA;
const user_collection = process.env.REACT_APP_COLLECTION_MONGO_USER_NAME;
const User = () => {
  const [validated, setValidated] = useState(false);
  const [userSearch, setUserSearch] = useState({hits: []});
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
    const data = await axios.get(url + ':' + user_port + '/' + user_collection);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(0);
  const [user, setUser] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const [userPerPage] = useState(LIMIT);
  const lastUser = number * userPerPage;
  const firstUser = lastUser - userPerPage;
  const currentData = data.slice(firstUser, lastUser);
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(user.length / userPerPage); i++) {
    pageNumber.push(i);
  }
  const changePage = (pageNumber) => {
    setNumber(pageNumber);
  };
  useEffect(() => {
    const getData = async () => {
      const data = await axios.get(url + ':' + user_port + '/' + user_collection);
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
    setUser({
      name: value
    })
  };
  const changeInputSlug = (value) => {
    setUser({
      slug: value
    })
  };
  const changeInputSearch = async (value) => {
    setUserSearch({
      name: value
    });
    const data = await axios.get(url + ':' + user_port + '/' + user_collection + '/find?name=' + value);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const changeTextarea = (value) => {
    setUser({
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
      const user = {
        fullname: form.userFullName.value,
        email: form.userEmail.value,
        username: form.userName.value,
        password: form.userPassword.value,
        department: form.userDepartment.value,
      };
      console.log(action);
      console.log(user);
      if (action === 'edit') {
        edit(id, user, config);
      } else {
        create(user, config);
      }
    }
    loadData();
  };
  const editItem = (event, id) => {
    setVisible(!visible);
    setId(id);
    setAction('edit');
    axios.get(url + ':' + user_port + '/' + user_collection + '/edit/' + id)
      .then(res => {
        setUser(res.data);
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
            <strong>{t('user.add')}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              {/* fullname */}
              <div className="mb-3">
                <CFormLabel htmlFor="userFullName">{t('user.label_fullname')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('user.validate_input_fullname')} id="userFullName" value={user.fullname}
                            required/>
              </div>
              {/* email */}
              <div className="mb-3">
                <CFormLabel htmlFor="userEmail">{t('user.label_email')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('user.validate_input_email')} id="userEmail" value={user.email}
                            required/>
              </div>
              {/* username */}
              <div className="mb-3">
                <CFormLabel htmlFor="userName">{t('user.label_username')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('user.validate_input_username')} id="userName" value={user.username}
                            required/>
              </div>
              {/* password */}
              <div className="mb-3">
                <CFormLabel htmlFor="userPassword">{t('user.label_password')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('user.validate_input_password')} id="userPassword" value={user.password}
                            required/>
              </div>
              {/* department */}
              <div className="mb-3">
                <CFormLabel htmlFor="userDepartment">{t('user.label_department')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('user.validate_input_department')} id="userDepartment" value={user.department}
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
          <CFormLabel htmlFor="userSearchName">{t('user.search')}</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text" id="userSearchName"
                      placeholder={t('user.validate_input_username')} value={userSearch.fullname} required/>
        </div>
        <CTable bordered borderColor='primary'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">{t('column_id')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('user.column_email')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('column_action')}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((item, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                <CTableDataCell>{item.email}</CTableDataCell>
                <CTableDataCell>
                  {/*<Link onClick={() => setVisible(!visible)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;*/}
                  <Link onClick={e => editItem(e, item._id)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;
                  <Link onClick={(e) => {
                    if (window.confirm(t('user.confirm_delete'))) {
                      deleteItem(event, item._id);
                    }
                  }}><CIcon icon={cilTrash}/></Link>
                </CTableDataCell>
                <CModal visible={visible} onClose={() => {setVisible(false); loadData()}}>
                  <CModalHeader>
                    <CModalTitle>{t('user.edit')}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CForm noValidate validated={validated} onSubmit={handleSubmit} id={'userForm'}>
                      {/* fullname */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="userFullName">{t('user.label_fullname')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('user.validate_input_fullname')} id="userFullName" value={user.fullname}
                                    required/>
                      </div>
                      {/* email */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="userEmail">{t('user.label_email')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('user.validate_input_email')} id="userEmail" value={user.email}
                                    required/>
                      </div>
                      {/* username */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="userName">{t('user.label_username')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('user.validate_input_username')} id="userName" value={user.username}
                                    required/>
                      </div>
                      {/* password */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="userPassword">{t('user.label_password')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('user.validate_input_password')} id="userPassword" value={user.password}
                                    required/>
                      </div>
                      {/* department */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="userDepartment">{t('user.label_department')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('user.validate_input_department')} id="userDepartment" value={user.department}
                                    required/>
                      </div>
                    </CForm>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => {setVisible(false);}}>
                      {t('btn_close')}
                    </CButton>
                    <CButton color="primary" type="submit" form={'userForm'}>
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

export default User
