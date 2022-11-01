import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Welcome from './components/Welcome';
import Clothes from './components/Clothes'; // Import component vào
import List from './components/List'; // Import component vào
import Students from './components/Students'; // Import component vào
import FunctionExample from './components/FunctionExample';
import ClassExample from './components/ClassExample';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <ClassExample />
      </>
    )
  }
}
export default App;
