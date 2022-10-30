import { any } from "prop-types";
import React, { Component } from "react"; // Component của React
import FunctionExample from "./FunctionExample";
interface Props {
    name: string;
    age?: Number;
    pet?: Dog;
    address?: any;
}
class ClassExample extends Component<any, any> {
    // Không sử dụng this ở đây
    constructor(props: Props) {
        // Sử dụng this trong contructor
        // Khi gọi super sẽ dùng được this, dùng this để truy cập 
        super(props); // super sẽ refer đến hàm khởi tạo của class cha (parent class constructor: React.Component)
        this.props = props;
        this.state = {
            content: 'Hello World!'
        };
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
            </div>
        );
    }
}
export default ClassExample;