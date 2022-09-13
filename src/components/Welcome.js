// Import react vào trong dự án
import React, {Component} from "react";
class Welcome extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            date: new Date(),
            clickedStatus: false,
            list: []
        };
    }
    componentWillMount() {
        console.log('Component will mount!');
    }
    componentDidMount() {
        console.log('Component did mount!');
        this.getList();
    }
    getList=()=>{
        /*** Method to make api call 
        fetch('https://api.mydomain.com')
            .then(response=>response.json())
            .then(data=>this.setState({list:data}));*/
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.list !== nextState.list
    }
    componentWillUpdate(nextProps, nextState) {
        console.log('Component will update!');
    }
    componentDidUpdate(prevProps, prevState) {
        console.log('Component did update!');
    }
    componentWillUnmount() {
        console.log('Component will unmount');
    }
    render() {
        return (
            <div>
                <h2>Mounting Lifecycle Methods</h2>
                <h1>Welcome! I am a class component</h1>
            </div>
        )
    }
}
export default Welcome;