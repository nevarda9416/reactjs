import { any } from "prop-types";
import React, { Component } from "react"; // Component của React
import FunctionExample from "./FunctionExample";
interface Props {
    name: string;
    age?: Number;
    pet?: Dog;
    address?: any;
}
interface State {
    status?: String;
}
class ClassExample extends Component<any, any, State> {
    // Không sử dụng this ở đây
    constructor(props: Props) {
        // Sử dụng this trong contructor
        // Khi gọi super sẽ dùng được this, dùng this để truy cập 
        super(props); // super sẽ refer đến hàm khởi tạo của class cha (parent class constructor: React.Component)
        this.props = props;
        this.state = {
            isLoaded: false,
            items: [],
            status: 'Đang học',
            content: 'Hello World!'
        };
    }
    changeStatus = () => {
        this.setState({
            status: this.state.status === 'Đang học' ? 'State phải gắn trong function tự định nghĩa' : 'Đang học'
        });
    }
    componentWillMount() {
        // Phương thức được gọi trước khi render
        // Không sử dụng setState()
    }
    componentDidMount() {
        // Thường sử dụng setState()
        // + Gọi ajax, get data từ API
        // + Khai báo setTimeout, setInterval
        // + Khai báo event như load, scroll, resize,...
        this.setState({
            status: this.state.status === 'Đang học' ? 'State phải gắn trong lifecycle' : 'Đang học'
        });
        fetch('https://datausa.io/api/data?drilldowns=Nation&measures=Population')
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result.data);
                    this.setState({
                        isLoaded: true,
                        items: result.data
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components
                (error) => {
                    this.setState({
                        isLoaded: false,
                        items: [],
                        error
                    });
                }
            )
    }
    showMessageFunction = (name: string) => {
        alert("Hello, I'm " + name);
    }
    static defaultProps = {
        name: "Tên mặc định",
        age: 1,
        address: "Việt Nam",
    }
    render() {
        const { isLoaded, items, error } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {
            return (
                <div>
                    <h1>United States</h1>
                    <ul>
                        {items.map(item => (
                            <li><b>Năm</b>: {item.Year} - <b>Dân số</b>: {item.Population}</li>
                        ))}
                    </ul>
                    <h2>I'm Parent</h2>
                    <FunctionExample showMessage={this.showMessageFunction} />
                    <h2>{this.props.address}</h2>
                    <h3>{this.state.status}</h3>
                    <button onClick={() => this.changeStatus()}>Thay đổi trạng thái</button>
                </div>
            );
        }
    }
}
export default ClassExample;