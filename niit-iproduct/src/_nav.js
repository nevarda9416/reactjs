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
import {Translation} from "react-i18next";
import i18next from "i18next";
import common_vi from "./translations/vi/common.json";
import common_en from "./translations/en/common.json";

i18next.init({
  interpolation: {escapeValue: false},  // React already does escaping
  lng: 'en',                              // language to use
  resources: {
    vi: {
      common: common_vi
    },
    en: {
      common: common_en               // 'common' is our custom namespace
    },
  },
});
const _nav = [
  {
    component: CNavItem,
    name: 'nav.dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'nav.management',
  },
  {
    component: CNavItem,
    name: 'nav.category',
    to: '/categories',
    icon: <CIcon icon={cilBookmark} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'nav.product',
    to: '/products',
    icon: <CIcon icon={cilListHighPriority} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'nav.tag',
    to: '/tags',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'nav.user',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'nav.activity',
    to: '/activities',
    icon: <CIcon icon={cilActionUndo} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'nav.system',
    to: '/systems',
    icon: <CIcon icon={cilAssistiveListeningSystem} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'nav.seo',
    to: '/seo',
    icon: <CIcon icon={cibGoogle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'nav.comment',
    to: '/comments',
    icon: <CIcon icon={cilCommentSquare} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'nav.data',
  },
  {
    component: CNavItem,
    name: 'nav.google_trend',
    to: '/google/trend',
    icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'nav.crawl_product',
    to: '/data/product',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'nav.customer',
    to: '/customers',
    icon: <CIcon icon={cilUserFemale} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'nav.tracking',
    to: '/trackings',
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'nav.traffic_source',
    to: '/traffic_sources',
    icon: <CIcon icon={cibOpenSourceInitiative} customClassName="nav-icon" />,
  },
];

export default _nav
