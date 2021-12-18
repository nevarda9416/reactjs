import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import axios from 'axios';
import {ArcElement} from 'chart.js';
import Chart from 'chart.js/auto';

Chart.register(ArcElement);

export default class BarChartComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {}
        }
    }

    componentDidMount() {
        axios.get(`http://127.0.0.1:8000/golds`)
            .then(res => {
                const data = res.data;
                let brands = [];
                let sells = [];
                if (data) {
                    data.forEach(element => {
                        brands.push(element.brand + ' (' + element.company + ')');
                        sells.push(Number(element.price));
                    });
                }
                this.setState({
                    chartData: {
                        labels: brands,
                        datasets: [
                            {
                                label: 'Giá vàng trong nước bán ra (VNĐ/lượng)',
                                backgroundColor: 'yellow',
                                data: sells
                            }
                        ]
                    }
                });
            })
    }

    render() {
        return (
            <div>
                {
                    Object.keys(this.state.chartData).length &&
                    <Bar
                        data={this.state.chartData}
                        options={{maintainAspectRatio: false}}/>
                }
            </div>
        )
    }
}
