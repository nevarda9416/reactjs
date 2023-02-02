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
  CFormSelect,
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert
} from '@coreui/react';
import {
  cilPencil,
  cilTrash
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {create, edit, deleteById} from "../../services/API/Product/ProductClient";
import {useTranslation} from "react-i18next";

const url = process.env.REACT_APP_URL;
const category_port = process.env.REACT_APP_PORT_DATABASE_MONGO_CATEGORY_CRUD_DATA;
const product_port = process.env.REACT_APP_PORT_DATABASE_MONGO_PRODUCT_CRUD_DATA;
const ToolProduct = () => {
  const [visible, setVisible] = useState(false);
  const LIMIT = process.env.REACT_APP_LIMIT_DATA_RETURN_TABLE;
  // Generate a random number and convert it to base 36 (0-9a-z): TOKEN CHƯA ĐƯỢC SỬ DỤNG
  const token = Math.random().toString(36).substr(2); // remove `0.`
  const config = {
    headers: {Authorization: `Bearer ${token}`}
  };
  const [load, setLoad] = useState(0);
  useEffect(() => {
    
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
  const [t, i18n] = useTranslation('common');
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
