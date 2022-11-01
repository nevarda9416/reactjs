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
            data: [],
            status: 'Đang học',
            content: 'Hello World!'
        };
        // Need to bind this.loadData in the component constructor
        this.loadData = this.loadData.bind(this);
    }
    changeStatus = () => {
        this.setState({
            status: this.state.status === 'Đang học' ? 'State phải gắn trong function tự định nghĩa' : 'Đang học'
        });
    }
    async loadData() {
        try {
            const res = await
                fetch('https://randomuser.me/api/');
            const response = await res.json();
            const result = response.results;
            this.setState({
                data: result
            });
        } catch (e) {
            console.log(e);
        }
    }
    componentWillMount() {
        // Phương thức được gọi trước khi render
        // Không sử dụng setState() vì chưa có DOM để tương tác
        console.log("1) componentWillMount!");
    }
    componentDidMount() {
        console.log("2) componentDidMount!");
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
        this.loadData();
        setInterval(this.loadData, 4000);
    }
    // 3.2
    componentWillReceiveProps() {
        // Dùng để update lại props bị thay đổi với param truyền vào của method là nextProps
        console.log("3) componentWillReceiveProps!");
    }
    shouldComponentUpdate() {
        // Phương thức xác định component này nên được update hay không
        console.log("4) shouldComponentUpdate!");
        return true; // true: tiếp tục thực hiện componentWillUpdate() và componentDidUpdate() 
    }
    componentWillUpdate() {
        // Phương thức được gọi 1 lần duy nhất sau shouldComponentUpdate()
        // Sử dụng trước khi re-render component
        console.log("5) componentWillUpdate!");
    }
    componentDidUpdate() {
        // Tương tự componentDidMount(), phương thức được gọi sau khi DOM đã được update xong
        // Thực hiện gọi AJAX, get data từ server (API)
        // Thực hiện giao diện dựa vào dữ liệu nhận được
        console.log("6) componentDidUpdate!");
    }
    // 3.3
    componentWillUnmount() {
        // Được gọi khi unmount 1 component như xóa nó khỏi react
        console.log("7) componentWillUnmount!");
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
        const { isLoaded, items, data, error } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {
            return (
                <div>
                    <h1>Random person</h1>
                    {data.map(item => (
                        <p>
                            <b>Gender:</b> {item.gender}<br />
                            <b>Name:</b> {item.name.title}. {item.name.first} {item.name.last}<br />
                            <b>Gender:</b> {item.email}<br />
                            <b>Age:</b> {item.dob.age}<br />
                        </p>
                    ))}
                    <h2>United States</h2>
                    <ul>
                        {items.map(item => (
                            <li><b>Năm</b>: {item.Year} - <b>Dân số</b>: {item.Population}</li>
                        ))}
                    </ul>
                    <h2>I'm Parent</h2>
                    <FunctionExample showMessage={this.showMessageFunction} />
                    <h3>{this.props.address}</h3>
                    <h3>{this.state.status}</h3>
                    <button onClick={() => this.changeStatus()}>Thay đổi trạng thái</button>
                </div>
            );
        }
    }
}
export default ClassExample;