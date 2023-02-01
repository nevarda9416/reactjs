import { React, useEffect, useState } from 'react';
import {
    CContainer,
    CCol,
    CRow,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react';
import {
    cilMagnifyingGlass
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import { useTranslation } from "react-i18next";

const url = process.env.REACT_APP_URL;
const category_port = process.env.REACT_APP_PORT_DATABASE_MONGO_CATEGORY_CRUD_DATA;
const product_port = process.env.REACT_APP_PORT_DATABASE_MONGO_PRODUCT_CRUD_DATA;
const Product = () => {
    const [validated, setValidated] = useState(false);
    const [productSearch, setProductSearch] = useState({ hits: [] });
    const [id, setId] = useState(0);
    const [action, setAction] = useState({ hits: [] });
    const LIMIT = process.env.REACT_APP_LIMIT_DATA_RETURN_TABLE;
    // Generate a random number and convert it to base 36 (0-9a-z): TOKEN CHƯA ĐƯỢC SỬ DỤNG
    const token = Math.random().toString(36).substr(2); // remove `0.`
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(0);
    const [category, setCategory] = useState([]);
    const [product, setProduct] = useState([]);
    const [number, setNumber] = useState(1); // No of pages
    const [productPerPage] = useState(LIMIT);
    const lastProduct = number * productPerPage;
    const firstProduct = lastProduct - productPerPage;
    const currentData = data.slice(firstProduct, lastProduct);
    const pageNumber = [];
    for (let i = 1; i <= Math.ceil(product.length / productPerPage); i++) {
        pageNumber.push(i);
    }
    const changePage = (pageNumber) => {
        setNumber(pageNumber);
    };
    useEffect(() => {
        const getData = async () => {
            const dataC = await axios.get(url + ':' + category_port + '/categories');
            const dataJC = await dataC.data;
            setCategory(dataJC);
            const dataP = await axios.get(url + ':' + product_port + '/products');
            const dataJP = await dataP.data;
            setData(dataJP);
        };
        getData();
    }, [load]);
    const changeInputSearch = async (value) => {
        setProductSearch({
            name: value
        });
        const data = await axios.get(url + ':' + product_port + '/products/find?name=' + value);
        const dataJ = await data.data;
        setData(dataJ);
    };
    const [t, i18n] = useTranslation('common');
    return (
        <CRow>
            <CCol xs={12}>
                <div className="bg-light mb-4 d-flex flex-row align-items-center">
                    <CContainer>
                        <CRow className="justify-content-center">
                            <CCol md={6}>
                                <span className="clearfix">
                                    <h4 className="pt-3">{t('product.search')}</h4>
                                </span>
                                <CInputGroup className="input-prepend">
                                    <CInputGroupText>
                                        <CIcon icon={cilMagnifyingGlass} />
                                    </CInputGroupText>
                                    <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text" id="productSearchName"
                                        placeholder={t('product.validate_input_name')} value={productSearch.name} required />
                                </CInputGroup>
                            </CCol>
                        </CRow>
                    </CContainer>
                </div>
                <div className="mb-3">{t('product.example_keyword')}: Macbook Air M1</div>
                <CTable bordered borderColor='primary'>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">{t('column_id')}</CTableHeaderCell>
                            <CTableHeaderCell scope="col">{t('product.column_name')}</CTableHeaderCell>
                            <CTableHeaderCell scope="col">{t('product.column_price')}</CTableHeaderCell>
                            <CTableHeaderCell scope="col">{t('product.column_link')}</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {currentData.map((item, index) => (
                            <CTableRow key={index}>
                                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                                <CTableDataCell>{item.name}</CTableDataCell>
                                <CTableDataCell>{item.currency !== 'VND' ? item.currency + ' ' : ''}{item.price.toLocaleString()}{item.currency === 'VND' ? ' ' + item.currency : ''}</CTableDataCell>
                                <CTableDataCell><a href={item.link} target="_blank">{item.link}</a></CTableDataCell>
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

export default Product
