import { createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  welcome: 'Chào mừng đến với trang quản trị'
};

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
};

const store = createStore(changeState)
export default store
