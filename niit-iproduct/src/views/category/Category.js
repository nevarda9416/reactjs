import React, { useEffect, useState } from 'react'
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

const url = process.env.APP_URL;
const port = process.env.PORT_DATABASE_MONGO_CATEGORY_CRUD_DATA;
const Category = () => {
    const [validated, setValidated] = useState(false)
    const [persons, setPersons] = useState({ hits: [] })
    useEffect(() => {
        axios(url + ':' + port + '/categories')
            .then(res => {
                console.log(res.data);
                return res.data;
            })
            .then(res => {
                setPersons(res);
            })
            .catch(error => console.log(error));
    }, [])
    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            setValidated(true)
            event.preventDefault()
            event.stopPropagation()
        } else {
            setValidated(false)
            const category = {
                name: form.categoryName.value,
                dbname: form.categoryName.value,
                description: form.categoryDescription.value
            };
            console.log(category);
            // Generate a random number and convert it to base 36 (0-9a-z)
            const token = Math.random().toString(36).substr(2); // remove `0.`
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            axios.post(url + ':' + port + '/categories/add', category, config)
                .then(res => {
                    console.log(res);                    
                    axios(url + ':' + port + '/categories')
                    .then(res => {
                        console.log(res.data);
                        return res.data;
                    })
                    .then(res => {
                        setPersons(res);
                    })
                    .catch(error => console.log(error));
                    return res;
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
                            <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {!validated && persons.map && persons.map(item => (
                            <CTableRow>
                                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                                <CTableDataCell>{item.name}</CTableDataCell>
                                <CTableDataCell>{item.description}</CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CCol>
        </CRow>
    )
}

export default Category
