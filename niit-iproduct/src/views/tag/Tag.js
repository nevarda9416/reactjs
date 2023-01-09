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
} from '@coreui/react';
import {
  cilPencil,
  cilTrash
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {create, edit, deleteById} from "../../services/API/Tag/TagClient";

const url = process.env.REACT_APP_URL;
const tag_port = process.env.REACT_APP_PORT_DATABASE_MONGO_TAG_CRUD_DATA;
const tag_collection = process.env.REACT_APP_COLLECTION_MONGO_TAG_NAME;
const Tag = () => {
  const [validated, setValidated] = useState(false);
  const [tagSearch, setTagSearch] = useState({hits: []});
  const [id, setId] = useState(0);
  const [action, setAction] = useState({hits: []});
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
    const data = await axios.get(url + ':' + tag_port + '/' + tag_collection);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(0);
  const [category, setCategory] = useState([]);
  const [tag, setTag] = useState([]);
  const [number, setNumber] = useState(1); // No of pages
  const [tagPerPage] = useState(LIMIT);
  const lastTag = number * tagPerPage;
  const firstTag = lastTag - tagPerPage;
  const currentData = data.slice(firstTag, lastTag);
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(tag.length / tagPerPage); i++) {
    pageNumber.push(i);
  }
  const changePage = (pageNumber) => {
    setNumber(pageNumber);
  };
  useEffect(() => {
    const getData = async () => {
      const dataP = await axios.get(url + ':' + tag_port + '/' + tag_collection);
      const dataJP = await dataP.data;
      setData(dataJP);
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
  const changeInput = (value) => {
    setTag({
      name: value
    })
  };
  const changeInputSearch = async (value) => {
    setTagSearch({
      name: value
    });
    const data = await axios.get(url + ':' + tag_port + '/' + tag_collection + '/find?name=' + value);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const changeTextarea = (value) => {
    setTag({
      full_description: value
    })
  };
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log(form);
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setValidated(false);
      const tag = {
        name: form.tagName.value,
        slug: form.tagSlug.value,
        description: form.tagDescription.value
      };
      console.log(action);
      if (action === 'edit') {
        console.log(tag);
        edit(id, tag, config);
        loadData();
      } else {
        axios.post(url + ':' + tag_port + '/' + tag_collection + '/add', tag, config)
          .then(res => {
            console.log(res);
            loadData();
            return res;
          })
          .catch(error => console.log(error));
      }
    }
  };
  const editItem = (event, id) => {
    setId(id);
    setAction('edit');
    axios.get(url + ':' + tag_port + '/' + tag_collection + '/edit/' + id)
      .then(res => {
        setTag(res.data);
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
                <CFormLabel htmlFor="tagName">Tên từ khóa</CFormLabel>
                <CFormInput type="text"
                            feedbackInvalid="Vui lòng nhập Tên từ khóa" id="tagName" value={tag.name}
                            required/>
              </div>
              {/* slug */}
              <div className="mb-3">
                <CFormLabel htmlFor="tagPrice">Slug</CFormLabel>
                <CFormInput type="text" id="tagPrice" value={tag.slug}
                            required/>
              </div>
              {/* description */}
              <div className="mb-3">
                <CFormLabel htmlFor="tagShortDescription">Mô tả</CFormLabel>
                <CFormTextarea feedbackInvalid="Vui lòng nhập mô tả" id="tagShortDescription" rows="3" required
                  value={tag.description}/>
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
          <CFormLabel htmlFor="tagSearchName">Tìm kiếm từ khóa</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text" id="tagSearchName"
                      placeholder="Vui lòng nhập từ khóa" value={tagSearch.name} required/>
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
                  <Link onClick={e => editItem(e, item._id)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;
                  <Link onClick={(e) => {
                    if (window.confirm('Delete this tag?')) {
                      deleteItem(event, item._id);
                    }
                  }}><CIcon icon={cilTrash}/></Link>
                </CTableDataCell>
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

export default Tag
