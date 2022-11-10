import React, { useState } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react';
import GoogleTrend from 'src/components/GoogleTrend';


const GoogleTrends = () => {
    const useQuery = () => new URLSearchParams(location.search);
    const query = useQuery();
    const keyword = query.get('keyword');
    //console.log(keyword);
    const [inputField, setInputField] = useState({
        keyword: keyword,
    })
    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Google Trend</strong>
                    </CCardHeader>
                    <CCardBody>
                        <form>
                            <label>Nhập từ khóa xu hướng tìm kiếm:&nbsp;
                                <input type="text" name="keyword" onChange={e => setInputField({ keyword: e.target.value })} value={inputField.keyword} placeholder="Từ khóa" />
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
}

export default GoogleTrends
