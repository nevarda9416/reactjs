import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CNavLink
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cifGb, cifVn } from '@coreui/icons'
import axios from 'axios'
import {useTranslation} from "react-i18next";

const url = process.env.REACT_APP_URL;
const port = process.env.REACT_APP_PORT_DATABASE_MONGO_USER_CRUD_DATA;
const Login = () => {
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
        setValidated(true)
        event.preventDefault()
        event.stopPropagation()
    } else {
        setValidated(false)
        const user = {
            username: form.username.value,
            password: form.password.value,
        };
        console.log(user);
        // Generate a random number and convert it to base 36 (0-9a-z)
        const token = Math.random().toString(36).substr(2); // remove `0.`
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
      event.preventDefault()
      event.stopPropagation()
        axios.post(url + ':' + port + '/admin/login', user, config)
            .then(res => {
                console.log(res);
                if (res.data.user === true) {
                  navigate ('/dashboard');
                } else {
                  return res;
                }
            })
            .catch(error => console.log(error));
    }
  }
  const [t, i18n] = useTranslation('common');
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                        <CNavLink onClick={() => i18n.changeLanguage('vi')} style={{ display: "inline-block", margin: "0 1rem 1rem 0" }}>
                            <CIcon icon={cifVn} size="lg" />
                        </CNavLink>
                        <CNavLink onClick={() => i18n.changeLanguage('en')} className="d-inline">
                            <CIcon icon={cifGb} size="lg" />
                        </CNavLink>
                  <CForm noValidate validated={validated} onSubmit={handleSubmit}>
                    <h1>{t('login.title')}</h1>
                    <p className="text-medium-emphasis">{t('login.label')}</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder={t('placeholder_input_username')} autoComplete="off" id="username" required/>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder={t('placeholder_input_password')}
                        autoComplete="off"
                        id="password" required/>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          {t('btn_login')}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>{t('register.title')}</h2>
                    <p>
                      {t('register.label')}
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        {t('register.not_have_account')}
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
