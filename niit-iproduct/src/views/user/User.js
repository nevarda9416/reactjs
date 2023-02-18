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
  const [loggedInUser, setLoggedInUser] = useState({hits: []});
  const [visible, setVisible] = useState(false);
  const LIMIT = process.env.REACT_APP_LIMIT_DATA_RETURN_TABLE;
  // Generate a random number and convert it to base 36 (0-9a-z): TOKEN CHƯA ĐƯỢC SỬ DỤNG
  const token = Math.random().toString(36).substr(2); // remove `0.`
  const config = {
    headers: {Authorization: `Bearer ${token}`}
  };
  const loadData = async () => {
    const data = await axios.get(url + ':' + user_port + '/' + user_collection);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(0);
  const [user, setUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const userPerPage = LIMIT;
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
    const loggedInUser = localStorage.getItem('userLoggedInfo');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setLoggedInUser(foundUser);     
    }
    const getData = async () => {
      const data = await axios.get(url + ':' + user_port + '/' + user_collection);
      const dataJ = await data.data;
      setUsers(dataJ);
      setData(dataJ);
    };
    getData();
  }, [load]);
  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    setUser({...user,
      [name]: value
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
        user_id: loggedInUser.id,
        system_type: 'default' // CRUD action, replace system_id
      };
      console.log(action);
      console.log(user);
      if (action === 'edit') {
        edit(id, user, config);
      } else {
        create(user, config);
      }
      loadData();
    }
  };
  const editItem = (id) => {
    setVisible(!visible);
    setId(id);
    setAction('edit');
    axios.get(url + ':' + user_port + '/' + user_collection + '/edit/' + id)
      .then(res => {
        setUser(res.data);
      })
      .catch(error => console.log(error));
  };
  const deleteItem = (id) => {
    setId(id);
    setAction({'action': 'delete'});
    deleteById(id);
    setLoad(1);
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
                    if (number < Math.ceil(users.length / userPerPage))
                        setNumber(number + 1)
                    else
                        setNumber(Math.ceil(users.length / userPerPage))
                }}>
                {t('paginate_next')}
            </button>
            <button
                className="px-3 py-1 m-1 text-center btn btn-primary"
                onClick={() => {
                    setNumber(Math.ceil(users.length / userPerPage))
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
            <strong>{t('user.add_or_edit')}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              {/* fullname */}
              <div className="mb-3">
                <CFormLabel htmlFor="userFullName">{t('user.label_fullname')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('user.validate_input_fullname')} id="userFullName" name="fullname" value={user.fullname || ''}
                            required onChange={handleChange}/>
              </div>
              {/* email */}
              <div className="mb-3">
                <CFormLabel htmlFor="userEmail">{t('user.label_email')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('user.validate_input_email')} id="userEmail" name="email" value={user.email || ''}
                            required onChange={handleChange}/>
              </div>
              {/* username */}
              <div className="mb-3">
                <CFormLabel htmlFor="userName">{t('user.label_username')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('user.validate_input_username')} id="userName" name="username" value={user.username || ''}
                            required onChange={handleChange}/>
              </div>
              {/* password */}
              <div className="mb-3">
                <CFormLabel htmlFor="userPassword">{t('user.label_password')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('user.validate_input_password')} id="userPassword" name="password" value={user.password || ''}
                            required onChange={handleChange}/>
              </div>
              {/* department */}
              <div className="mb-3">
                <CFormLabel htmlFor="userDepartment">{t('user.label_department')}</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid={t('user.validate_input_department')} id="userDepartment" name="department" value={user.department || ''}
                            required onChange={handleChange}/>
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
        {pagination}
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
                  <Link onClick={e => editItem(item._id)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;
                  <Link onClick={(e) => {
                    if (window.confirm(t('user.confirm_delete'))) {
                      deleteItem(item._id);
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
                                    feedbackInvalid={t('user.validate_input_fullname')} id="userFullName" name="fullname" value={user.fullname || ''}
                                    required onChange={handleChange}/>
                      </div>
                      {/* email */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="userEmail">{t('user.label_email')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('user.validate_input_email')} id="userEmail" name="email" value={user.email || ''}
                                    required onChange={handleChange}/>
                      </div>
                      {/* username */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="userName">{t('user.label_username')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('user.validate_input_username')} id="userName" name="username" value={user.username || ''}
                                    required onChange={handleChange}/>
                      </div>
                      {/* password */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="userPassword">{t('user.label_password')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('user.validate_input_password')} id="userPassword" name="password" value={user.password || ''}
                                    required onChange={handleChange}/>
                      </div>
                      {/* department */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="userDepartment">{t('user.label_department')}</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid={t('user.validate_input_department')} id="userDepartment" name="department" value={user.department || ''}
                                    required onChange={handleChange}/>
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
        {pagination}
      </CCol>
    </CRow>
  )
};

export default User
