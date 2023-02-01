import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react';
import axios from 'axios';
import {useTranslation} from "react-i18next";

const url = process.env.REACT_APP_URL;
const activity_port = process.env.REACT_APP_PORT_DATABASE_MONGO_ACTIVITY_CRUD_DATA;
const activity_collection = process.env.REACT_APP_COLLECTION_MONGO_ACTIVITY_NAME;
const Dashboard = () => {
  const [cproduct, setCProduct] = useState(0);
  const [ccategory, setCCategory] = useState(0);
  const [ctag, setCTag] = useState(0);
  useEffect(() => {    
    const getData = async () => {
      const data = await axios.get(url + ':' + activity_port + '/' + activity_collection + '/count');
      const dataC = await data.data;
      setCProduct(dataC.product);
      setCCategory(dataC.category);
      setCTag(dataC.tag);
    };
    getData();
  });
  const [t, i18n] = useTranslation('common');
  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>{t('dashboard.label_statistic')}</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={12} xl={12}>
                  <CRow>
                    <CCol sm={4}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <h5 className="text-medium-emphasis">{t('dashboard.label_statistic_product')}</h5>
                        <div className="fs-5 fw-semibold">{cproduct}</div>
                      </div>
                    </CCol>
                    <CCol sm={4}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <h5 className="text-medium-emphasis">{t('dashboard.label_statistic_category')}</h5>
                        <div className="fs-5 fw-semibold">{ccategory}</div>
                      </div>
                    </CCol>
                    <CCol sm={4}>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <h5 className="text-medium-emphasis">{t('dashboard.label_statistic_tag')}</h5>
                        <div className="fs-5 fw-semibold">{ctag}</div>
                      </div>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
