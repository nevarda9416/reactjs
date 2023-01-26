import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBookmark,
  cilListHighPriority,
  cilSpeedometer,
  cilUser,
  cilActionUndo,
  cilAssistiveListeningSystem,
  cibGoogle,
  cilCommentSquare,
  cilUserFemale,
  cilNotes,
  cilUserFollow,
  cibOpenSourceInitiative,
  cilGraph,
  cilList,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Quản lý',
  },
  {
    component: CNavItem,
    name: 'Danh mục sản phẩm',
    to: '/categories',
    icon: <CIcon icon={cilBookmark} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Danh sách sản phẩm',
    to: '/products',
    icon: <CIcon icon={cilListHighPriority} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Danh sách từ khóa',
    to: '/tags',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Danh sách người quản lý',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Thống kê hoạt động',
    to: '/activities',
    icon: <CIcon icon={cilActionUndo} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Hệ thống',
    to: '/systems',
    icon: <CIcon icon={cilAssistiveListeningSystem} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'SEO',
    to: '/seo',
    icon: <CIcon icon={cibGoogle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Bình luận',
    to: '/comments',
    icon: <CIcon icon={cilCommentSquare} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Dữ liệu',
  },
  {
    component: CNavItem,
    name: 'Google Trend',
    to: '/google/trend',
    icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Sản phẩm',
    to: '/data/product',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Khách hàng',
    to: '/customers',
    icon: <CIcon icon={cilUserFemale} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Theo dõi người dùng',
    to: '/trackings',
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Nguồn đăng ký tài khoản',
    to: '/traffic_sources',
    icon: <CIcon icon={cibOpenSourceInitiative} customClassName="nav-icon" />,
  },
];

export default _nav
