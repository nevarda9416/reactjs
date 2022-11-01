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
            status: 'Đang học',
            content: 'Hello World!'
        };
    }
    changeStatus = () => {
        this.setState({
            status: this.state.status === 'Đang học' ? 'State phải gắn trong function tự định nghĩa' : 'Đang học'
        });
    }
    componentDidMount() {
        this.setState({
            status: this.state.status === 'Đang học' ? 'State phải gắn trong lifecycle' : 'Đang học'
        });
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
        return (
            <div>
                <h1>I'm Parent</h1>
                <FunctionExample showMessage={this.showMessageFunction}/>
                <h2>{this.props.address}</h2>
                <h3>{this.state.status}</h3>
                <button onClick={()=>this.changeStatus()}>Thay đổi trạng thái</button>
            </div>
        );
    }
}
export default ClassExample;