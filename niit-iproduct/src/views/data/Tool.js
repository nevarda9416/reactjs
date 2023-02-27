import {React, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CAlert
} from '@coreui/react';
import axios from 'axios';
import {useTranslation} from "react-i18next";

const url = process.env.REACT_APP_URL;
const product_port = process.env.REACT_APP_PORT_DATABASE_MONGO_PRODUCT_CRUD_DATA;
const ToolProduct = () => {
  const [visible, setVisible] = useState(false);
  const [load, setLoad] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const expiredTime = localStorage.getItem('expiredTime');
    const loggedInUser = localStorage.getItem('userLoggedInfo');
    if (loggedInUser && Date.now() <= expiredTime) {
    } else {
      navigate('/login');
    }
  });
  const exportData = (e) => {
    setVisible(true);
    axios.get(url + ':' + product_port + '/products/export')
      .then(res => {
        if (res.data.success) {
            setLoad(1);
        }
        e.preventDefault();
      })
      .catch(error => console.log(error));
  };
  const importData = (e) => {
    setVisible(true);
    axios.get(url + ':' + product_port + '/products/import')
      .then(res => {
        if (res.data.success) {
            setLoad(2);
        }
        e.preventDefault();
      })
      .catch(error => console.log(error));
  };
  const [t] = useTranslation('common');
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{t('product.title')}</strong>
          </CCardHeader>
          <CCardBody>
            {load !== 0 &&
                <CAlert color="success" dismissible visible={visible} onClose={() => setVisible(false)}>
                  <strong>{load === 1 ? t('alert_export_success'): ''}
                            {load === 2 ? t('alert_import_success'): ''}</strong>
                </CAlert>
            }
            <CButton type="button" className="m-2" onClick={e => exportData(e)}>
                {t('btn_export_data')}
            </CButton>
            <CButton type="button" className="m-2" onClick={e => importData(e)}>
                {t('btn_import_data')}
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
};

export default ToolProduct
