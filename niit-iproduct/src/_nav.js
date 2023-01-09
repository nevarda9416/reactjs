import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilGraph,
  cilBookmark, cilListHighPriority
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

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
    name: 'Danh sách quản lý',
    to: '/users',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Thống kê hoạt động',
    to: '/activities',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Hệ thống',
    to: '/systems',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'SEO',
    to: '/seo',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Bình luận',
    to: '/comments',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
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
    name: 'Khách hàng',
    to: '/customers',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Theo dõi người dùng',
    to: '/tracking',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Nguồn đăng ký tài khoản',
    to: '/traffic_sources',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
]

export default _nav
