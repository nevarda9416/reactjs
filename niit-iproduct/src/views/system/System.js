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
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react';
import {
  cilPencil,
  cilTrash
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {create, edit, deleteById} from "../../services/API/System/SystemClient";

const url = process.env.REACT_APP_URL;
const system_port = process.env.REACT_APP_PORT_DATABASE_MONGO_SYSTEM_CRUD_DATA;
const system_collection = process.env.REACT_APP_COLLECTION_MONGO_SYSTEM_NAME;
const System = () => {
  const [validated, setValidated] = useState(false);
  const [systemSearch, setSystemSearch] = useState({hits: []});
  const [id, setId] = useState(0);
  const [action, setAction] = useState({hits: []});
  const [visible, setVisible] = useState(false);
  const LIMIT = process.env.REACT_APP_LIMIT_DATA_RETURN_TABLE;
  // Generate a random number and convert it to base 36 (0-9a-z): TOKEN CHƯA ĐƯỢC SỬ DỤNG
  const token = Math.random().toString(36).substr(2); // remove `0.`
  const config = {
    headers: {Authorization: `Bearer ${token}`}
  };
  const [state, setState] = useState({
    editor: null
  });
  const loadData = async () => {
    const data = await axios.get(url + ':' + system_port + '/' + system_collection);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(0);
  const [category, setCategory] = useState([]);
  const [system, setSystem] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const [systemPerPage] = useState(LIMIT);
  const lastSystem = number * systemPerPage;
  const firstSystem = lastSystem - systemPerPage;
  const currentData = data.slice(firstSystem, lastSystem);
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(system.length / systemPerPage); i++) {
    pageNumber.push(i);
  }
  const changePage = (pageNumber) => {
    setNumber(pageNumber);
  };
  useEffect(() => {
    const getData = async () => {
      const data = await axios.get(url + ':' + system_port + '/' + system_collection);
      const dataJ = await data.data;
      setData(dataJ);
    };
    getData();
    const editor = (
      <CKEditor
        editor={ClassicEditor}
        required
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({event, editor, data});
          changeTextarea(data);
        }}
        onBlur={(event, editor) => {
          console.log('Blur.', editor);
        }}
        onFocus={(event, editor) => {
          console.log('Focus.', editor);
        }}
      />
    );
    setState({...state, editor: editor});
  }, [load]);
  const changeInputName = (value) => {
    setSystem({
      name: value
    })
  };
  const changeInputSlug = (value) => {
    setSystem({
      slug: value
    })
  };
  const changeInputSearch = async (value) => {
    setSystemSearch({
      name: value
    });
    const data = await axios.get(url + ':' + system_port + '/' + system_collection + '/find?name=' + value);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const changeTextarea = (value) => {
    setSystem({
      description: value
    })
  };
  const handleSubmit = (event) => {
    const form = event.target;
    console.log(form);
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setValidated(false);
      const system = {
        name: form.systemName.value,
        slug: form.systemSlug.value,
        description: form.systemDescription.value
      };
      console.log(action);
      console.log(system);
      if (action === 'edit') {
        edit(id, system, config);
      } else {
        create(system, config);
      }
    }
    loadData();
  };
  const editItem = (event, id) => {
    setVisible(!visible);
    setId(id);
    setAction('edit');
    axios.get(url + ':' + system_port + '/' + system_collection + '/edit/' + id)
      .then(res => {
        setSystem(res.data);
        const editor = (
          <CKEditor
            editor={ClassicEditor}
            required
            data={res.data.full_description ?? ''}
            onReady={editor => {
              // You can store the "editor" and use when it is needed.
              editor.setData(res.data.full_description);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              console.log({event, editor, data});
              changeTextarea(data);
            }}
            onBlur={(event, editor) => {
              console.log('Blur.', editor);
            }}
            onFocus={(event, editor) => {
              console.log('Focus.', editor);
            }}
          />
        );
        setState({...state, editor: editor});
      })
      .catch(error => console.log(error));
  };
  const deleteItem = (event, id) => {
    setId(id);
    setAction({'action': 'delete'});
    deleteById(id);
    setLoad(1);
  };
  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Thêm mới từ khóa</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              {/* name */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemName">Tên từ khóa</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid="Vui lòng nhập tên từ khóa" id="systemName" value={system.name}
                            required/>
              </div>
              {/* slug */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemSlug">Slug</CFormLabel>
                <CFormInput type="text" id="systemSlug" value={system.slug}
                            required/>
              </div>
              {/* description */}
              <div className="mb-3">
                <CFormLabel htmlFor="systemDescription">Mô tả</CFormLabel>
                <CFormTextarea feedbackInvalid="Vui lòng nhập mô tả" id="systemDescription" rows="3" required
                               value={system.description}/>
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
      <CCol xs={6}>
        <div className="mb-3">
          <CFormLabel htmlFor="systemSearchName">Tìm kiếm từ khóa</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text" id="systemSearchName"
                      placeholder="Vui lòng nhập từ khóa" value={systemSearch.name} required/>
        </div>
        <CTable bordered borderColor='primary'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((item, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>
                  {/*<Link onClick={() => setVisible(!visible)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;*/}
                  <Link onClick={e => editItem(e, item._id)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;
                  <Link onClick={(e) => {
                    if (window.confirm('Delete this system?')) {
                      deleteItem(event, item._id);
                    }
                  }}><CIcon icon={cilTrash}/></Link>
                </CTableDataCell>
                <CModal visible={visible} onClose={() => {setVisible(false); loadData()}}>
                  <CModalHeader>
                    <CModalTitle>Sửa từ khóa</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CForm noValidate validated={validated} onSubmit={handleSubmit} id={'systemForm'}>
                      {/* name */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemName">Tên từ khóa</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid="Vui lòng nhập tên từ khóa" id="systemName"
                                    value={system.name}
                                    onChange={(e) => changeInputName(e.target.value)}
                                    required/>
                      </div>
                      {/* slug */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemSlug">Slug</CFormLabel>
                        <CFormInput type="text"
                                    feedbackInvalid="Vui lòng nhập slug" id="systemSlug"
                                    value={system.slug}
                                    onChange={(e) => changeInputSlug(e.target.value)}
                                    required/>
                      </div>
                      {/* description */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="systemDescription">Mô tả</CFormLabel>
                        <CFormTextarea feedbackInvalid="Vui lòng nhập mô tả" id="systemDescription" rows="3"
                                       value={system.description}
                                       onChange={(e) => changeTextarea(e.target.value)}
                                       required/>
                      </div>
                    </CForm>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => {setVisible(false);}}>
                      Close
                    </CButton>
                    <CButton color="primary" type="submit" form={'systemForm'}>
                      Lưu
                    </CButton>
                  </CModalFooter>
                </CModal>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <div className="my-3 text-center">
          <button
            className="px-3 py-1 m-1 text-center btn-primary"
            onClick={() => setNumber(number - 1)}>
            Trước
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
            Sau
          </button>
        </div>
      </CCol>
    </CRow>
  )
};

export default System
