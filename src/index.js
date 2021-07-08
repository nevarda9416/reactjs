import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

function sayHi(name) {
  if (name) {
    return <p>Xin chào, {name}!</p>
  } else {
    return <p>Xin chào bạn!</p>
  } 
}
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}
const user = {
  firstName: 'DAO',
  lastName: 'TU'
};
const name = 'Freetuts.net';
const element_0 = <div><h1>Welcome to {name}</h1><h2>{formatName(user)}</h2>
{sayHi('Tú')}
</div>
const element_1 = <div tabIndex="0"></div>;
const element_2 = <img src={user.avatarUrl}></img>;
const element_3 = <div tabIndex={"1"}></div>;
const element_4 = React.createElement(
  "p",
  {className: "welcome"},
  "Welcome to Freetuts.net!"  
);
const element_5 = {
  type: "p",
  props: {
    className: "welcome",
    children: "Welcome to Freetuts.net!"
  }  
}
const content = '<script>XSS</script>';
const element_6 = <p className="welcome">{content}</p>;
ReactDOM.render(
  //element_0,
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
