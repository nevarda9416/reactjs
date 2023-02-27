import React, { useState, useEffect } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react';
import GoogleTrend from 'src/components/GoogleTrend';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const GoogleTrends = () => {
    const useQuery = () => new URLSearchParams(location.search);
    const query = useQuery();
    const keyword = query.get('keyword');
    const [inputField, setInputField] = useState({
        keyword: keyword,
    });
    const navigate = useNavigate();
    useEffect(() => {
        const expiredTime = localStorage.getItem('expiredTime');
        const loggedInUser = localStorage.getItem('userLoggedInfo');
        if (loggedInUser && Date.now() <= expiredTime) {
        } else {
            navigate('/login');
        }
    }, []);
    const [t] = useTranslation('common');
    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>{t('google_trend.title')}</strong>
                    </CCardHeader>
                    <CCardBody>
                        <form>
                            <label>{t('google_trend.validate_input_serch_keyword')}&nbsp;
                                <input type="text" name="keyword" onChange={e => setInputField({ keyword: e.target.value })} value={inputField.keyword} placeholder={t('google_trend.placeholder_input_serch_keyword')} />
                            </label>
                        </form>
                        <div id="widget">
                            <GoogleTrend
                                type="RELATED_QUERIES"
                                keyword={keyword}
                                url="https://ssl.gstatic.com/trends_nrtr/3140_RC01/embed_loader.js"
                            />
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
};

export default GoogleTrends
