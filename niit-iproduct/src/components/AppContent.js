import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner, CAlert } from '@coreui/react'

// routes config
import routes from '../routes'
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
const AppContent = () => {
  const [t, i18n] = useTranslation('common');
  const welcome = useSelector((state) => state.welcome);
  return (
    <CContainer lg>
      <CAlert color="success" dismissible onClose={()=>{
        //alert("👋 Well, hi there! Thanks for dismissing me.")
      }}>
        <strong>{t('welcome')}</strong>
      </CAlert>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="search/product" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
