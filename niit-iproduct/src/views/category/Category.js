import React, { useState } from 'react'
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
} from '@coreui/react';
import axios from 'axios';

const Category = () => {
    const [validated, setValidated] = useState(false)
    const [persons, setPersons] = useState({ hits: [] })
    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            setValidated(true)
            event.preventDefault()
            event.stopPropagation()
        } else {
            setValidated(false)
            axios("https://hn.algolia.com/api/v1/search?query=redux")
                .then(res => {
                    return res.data;
                })
                .then(res => {
                    setPersons(res);
                })
                .catch(error => console.log(error));
        }
    }
    return (
        <CRow>
            <CCol xs={4}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Thêm mới danh mục</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm noValidate validated={validated} onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="categoryName">Tên danh mục</CFormLabel>
                                <CFormInput type="text" feedbackInvalid="Vui lòng nhập tên danh mục" id="categoryName" required />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="exampleFormControlTextarea1">Mô tả</CFormLabel>
                                <CFormTextarea feedbackInvalid="Vui lòng nhập mô tả" id="categoryDescription" rows="3" required></CFormTextarea>
                            </div>
                            <div className="col-auto">
                                <CButton type="submit" className="mb-3">
                                    Lưu
                                </CButton>
                            </div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs={8}>
            <CTable bordered borderColor='primary'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Url</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                    {!validated && persons.hits.map(item => (
                        <CTableRow>                            
                            <CTableHeaderCell scope="row">{item.objectID}</CTableHeaderCell>
                            <CTableDataCell>{item.title}</CTableDataCell>
                            <CTableDataCell>{item.url}</CTableDataCell>   
                        </CTableRow>
                    ))}                               
                </CTableBody>
              </CTable>
            </CCol>
        </CRow>
    )
}

export default Category
