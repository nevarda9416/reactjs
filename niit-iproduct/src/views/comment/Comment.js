import {React, useEffect, useState} from 'react'
import {Link} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import StarRatingComponent from 'react-star-rating-component';

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
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormSelect
} from '@coreui/react';
import {
  cilPencil,
  cilTrash
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {create, edit, deleteById} from "../../services/API/Comment/CommentClient";

const url = process.env.REACT_APP_URL;
const comment_port = process.env.REACT_APP_PORT_DATABASE_MONGO_COMMENT_CRUD_DATA;
const comment_collection = process.env.REACT_APP_COLLECTION_MONGO_COMMENT_NAME;
const Comment = () => {
  const [validated, setValidated] = useState(false);
  const [commentSearch, setCommentSearch] = useState({hits: []});
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
    const data = await axios.get(url + ':' + comment_port + '/' + comment_collection);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(0);
  const [comment, setComment] = useState([]);
  const [rating, setRating] = useState(1);
  const [number, setNumber] = useState(1); // No of pages
  const [commentPerPage] = useState(LIMIT);
  const lastComment = number * commentPerPage;
  const firstComment = lastComment - commentPerPage;
  const currentData = data.slice(firstComment, lastComment);
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(comment.length / commentPerPage); i++) {
    pageNumber.push(i);
  }
  const changePage = (pageNumber) => {
    setNumber(pageNumber);
  };
  useEffect(() => {
    const getData = async () => {
      const data = await axios.get(url + ':' + comment_port + '/' + comment_collection);
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
    setComment({
      name: value
    })
  };
  const changeInputSlug = (value) => {
    setComment({
      slug: value
    })
  };
  const changeInputSearch = async (value) => {
    setCommentSearch({
      name: value
    });
    const data = await axios.get(url + ':' + comment_port + '/' + comment_collection + '/find?name=' + value);
    const dataJ = await data.data;
    setData(dataJ);
  };
  const changeTextarea = (value) => {
    setComment({
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
      const comment = {
        name: form.commentName.value,
        slug: form.commentSlug.value,
        description: form.commentDescription.value
      };
      console.log(action);
      console.log(comment);
      if (action === 'edit') {
        edit(id, comment, config);
      } else {
        create(comment, config);
      }
    }
    loadData();
  };
  const editItem = (event, id) => {
    setVisible(!visible);
    setId(id);
    setAction('edit');
    axios.get(url + ':' + comment_port + '/' + comment_collection + '/edit/' + id)
      .then(res => {
        setComment(res.data);
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
  const onStarClick = (nextValue, prevValue, name) => {
    setRating(nextValue);
  };
  const [t, i18n] = useTranslation('common');
  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{t('comment.add')}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              {/* content */}
              <div className="mb-3">
                <CFormLabel htmlFor="commentContent">{t('comment.label_content')}</CFormLabel>
                <CFormTextarea feedbackInvalid={t('comment.validate_input_content')} id="commentContent" rows="3" required value={comment.content}/>
              </div>
              {/* status */}
              <div className="mb-3">
                <CFormLabel htmlFor="commentStatus">{t('comment.label_status')}</CFormLabel>
                <CFormSelect feedbackInvalid={t('comment.validate_input_status')} id="commentStatus" value={comment.status} required>
                  <option value='0'>Ẩn</option>
                  <option value='1'>Hiện</option>
                </CFormSelect>
              </div>
              {/* rate */}
              <div className="mb-3">
                <CFormLabel htmlFor="commentRate">{t('comment.label_rate')}</CFormLabel><br/>
                <StarRatingComponent
                  name='commentRate'
                  starCount={5}
                  value={comment.rate}
                  starColor='#f00'
                  onStarClick={e => onStarClick(e)}
                />
              </div>
              <div className="col-auto">
                <CButton type="submit" className="mb-3">
                  {t('btn_save')}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <div className="mb-3">
          <CFormLabel htmlFor="commentSearchName">{t('comment.search')}</CFormLabel>
          <CFormInput onChange={e => changeInputSearch(e.target.value)} type="text" id="commentSearchName"
                      placeholder={t('comment.validate_input_content')} value={commentSearch.name} required/>
        </div>
        <CTable bordered borderColor='primary'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">{t('column_id')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('comment.label_content')}</CTableHeaderCell>
              <CTableHeaderCell scope="col">{t('column_action')}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((item, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row">{item._id}</CTableHeaderCell>
                <CTableDataCell>{item.content}</CTableDataCell>
                <CTableDataCell>
                  {/*<Link onClick={() => setVisible(!visible)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;*/}
                  <Link onClick={e => editItem(e, item._id)}><CIcon icon={cilPencil}/></Link>&nbsp;&nbsp;
                  <Link onClick={(e) => {
                    if (window.confirm(t('comment.confirm_delete'))) {
                      deleteItem(event, item._id);
                    }
                  }}><CIcon icon={cilTrash}/></Link>
                </CTableDataCell>
                <CModal visible={visible} onClose={() => {setVisible(false); loadData()}}>
                  <CModalHeader>
                    <CModalTitle>{t('comment.edit')}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CForm noValidate validated={validated} onSubmit={handleSubmit} id={'commentForm'}>
                      {/* content */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="commentContent">{t('comment.label_content')}</CFormLabel>
                        <CFormTextarea feedbackInvalid="Vui lòng nhập nội dung bình luận" id="commentContent" rows="3" required value={comment.content}/>
                      </div>
                      {/* status */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="commentStatus">{t('comment.label_status')}</CFormLabel>
                        <CFormSelect feedbackInvalid="Vui lòng chọn trạng thái" id="commentStatus" value={comment.status} required>
                          <option value='0'>Ẩn</option>
                          <option value='1'>Hiện</option>
                        </CFormSelect>
                      </div>
                      {/* rate */}
                      <div className="mb-3">
                        <CFormLabel htmlFor="commentRate">{t('comment.label_rate')}</CFormLabel><br/>
                        <StarRatingComponent
                          name='commentRate'
                          starCount={5}
                          value={comment.rate}
                          starColor='#f00'
                          onStarClick={e => onStarClick(e)}
                        />
                      </div>
                    </CForm>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => {setVisible(false);}}>
                      {t('btn_close')}
                    </CButton>
                    <CButton color="primary" type="submit" form={'commentForm'}>
                      {t('btn_save')}
                    </CButton>
                  </CModalFooter>
                </CModal>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <div className="my-3 text-center">
          <CButton
            className="px-3 py-1 m-1 text-center btn-secondary"
            onClick={() => setNumber(number - 1)}>
            {t('paginate_previous')}
          </CButton>
          {pageNumber.map((element, index) => {
            return (
              <button key={index}
                      className="px-3 py-1 m-1 text-center btn-outline-dark"
                      onClick={() => changePage(element)}>
                {element}
              </button>
            );
          })}
          <CButton
            className="px-3 py-1 m-1 text-center btn-secondary"
            onClick={() => setNumber(number + 1)}>
            {t('paginate_next')}
          </CButton>
        </div>
      </CCol>
    </CRow>
  )
};

export default Comment
