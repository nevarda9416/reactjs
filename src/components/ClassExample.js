import React, { Component } from "react"; // Component của React
class ClassExample extends Component {
    // Không sử dụng this ở đây
    constructor(props:any) {
        // Sử dụng this trong contructor
        // Khi gọi super sẽ dùng được this, dùng this để truy cập 
        super(props); // super sẽ refer đến hàm khởi tạo của class cha (parent class constructor: React.Component)
        this.props = props;
        this.state = {
            content: 'Hello World!'
        };
    }
    render() {
        return (
            <h1>{this.state.content}</h1>
        );
    }
}
export default ClassExample;