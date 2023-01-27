import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {Provider} from 'react-redux'
import store from './store'
import {I18nextProvider} from "react-i18next";
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

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <I18nextProvider i18n={i18next}>
      <App/>
    </I18nextProvider>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
