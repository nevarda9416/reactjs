import React, {Component} from 'react';
import './App.css';
import BarChartComponent from './components/BarChartComponent';
import PieChartComponent from './components/PieChartComponent';
import LineChartComponent from './components/LineChartComponent';

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>LineChart</h1>
                <LineChartComponent/>
                <h1>BarChart</h1>
                <BarChartComponent/>
                <h1>PieChart</h1>
                <PieChartComponent/>
            </div>
        );
    }
}

export default App;
