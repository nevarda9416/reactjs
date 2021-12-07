import React, {Component} from 'react';
import './App.css';
import BarChartComponent from './components/BarChartComponent';
import PieChartComponent from './components/PieChartComponent';
import LineChartComponent from './components/LineChartComponent';

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>Tỷ giá vàng lấy từ API</h1>
                <BarChartComponent/>
            </div>
        );
    }
}

export default App;
