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
    CNavLink
} from '@coreui/react';
import {
    cilMagnifyingGlass,
    cifGb, cifVn
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import { useTranslation } from "react-i18next";

const url = process.env.REACT_APP_URL;
const product_port = process.env.REACT_APP_PORT_DATABASE_MONGO_PRODUCT_CRUD_DATA;
const Product = () => {
    const [productSearch, setProductSearch] = useState({ hits: [] });
    const LIMIT = process.env.REACT_APP_LIMIT_DATA_RETURN_TABLE;
    const [data, setData] = useState([]);
    const [product, setProduct] = useState([]);
    const [number, setNumber] = useState(1); // No of pages
    const [productPerPage] = LIMIT;
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
            const dataP = await axios.get(url + ':' + product_port + '/products');
            const dataJP = await dataP.data;
            setData(dataJP);
            setProduct(dataJP);
        };
        getData();
    });
    const changeInputSearch = async (value) => {
        setProductSearch({
            name: value
        });
        const data = await axios.get(url + ':' + product_port + '/products/find?name=' + value);
        const dataJ = await data.data;
        setData(dataJ);
    };
    const [t, i18n] = useTranslation('common');
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
                    if (number < Math.ceil(product.length / productPerPage))
                        setNumber(number + 1)
                    else
                        setNumber(Math.ceil(product.length / productPerPage))
                }}>
                {t('paginate_next')}
            </button>
            <button
                className="px-3 py-1 m-1 text-center btn btn-primary"
                onClick={() => {
                    setNumber(Math.ceil(product.length / productPerPage))
                }}>
                {t('paginate_last')}
            </button>
        </div>
        ;
    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow>
                    <CCol xs={12}>
                        <CNavLink onClick={() => i18n.changeLanguage('vi')} style={{ display: "inline-block", margin: "1rem 1rem 1rem 0" }}>
                            <CIcon icon={cifVn} size="lg" />
                        </CNavLink>
                        <CNavLink onClick={() => i18n.changeLanguage('en')} className="d-inline">
                            <CIcon icon={cifGb} size="lg" />
                        </CNavLink>
                    </CCol>
                </CRow>
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
                        {pagination}
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
                        {pagination}
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
};

export default Product
