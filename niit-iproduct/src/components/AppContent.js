import React, { Suspense, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import GoogleTrends from './GoogleTrends'

// routes config
import routes from '../routes'
const AppContent = () => {
  const useQuery = () => new URLSearchParams(location.search);
  const query = useQuery();
  const keyword = query.get('keyword');
  console.log(keyword);
  const [inputField, setInputField] = useState({
    keyword: keyword,
  })
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <form>
          <label>Nhập từ khóa xu hướng tìm kiếm&nbsp;
            <input type="text" name="keyword" onChange={e => setInputField({keyword: e.target.value})} value={inputField.keyword} placeholder="Từ khóa"/>
          </label>
        </form>
        <div id="widget">
          <GoogleTrends
            type="RELATED_QUERIES"
            keyword={keyword}
            url="https://ssl.gstatic.com/trends_nrtr/3140_RC01/embed_loader.js"
          />
        </div>
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
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
