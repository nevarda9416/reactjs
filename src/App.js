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
const USDtoVND = function(props) {
  const convert = function(usd) {
    return usd * 23632;
  }  
  return (
    <div>
      <FunctionExample/>
      <ClassExample/>
      <span>USD</span>
      <input onChange={(e)=>{
        const usd = e.target.value;
        const vnd = convert(usd);
        props.onHandleChange({
          usd,
          vnd
        });
      }} value={props.value}/>
    </div>
  )
}
const VNDtoUSD = function (props) {
  const convert = function(vnd) {
    return vnd/23632;
  }
  return (
    <div>
      <span>VND</span>
      <input onChange={(e)=>{
        const vnd = e.target.value;
        const usd = convert(vnd);
        props.onHandleChange({
          usd,
          vnd
        });
      }} value={props.value}/>
    </div>
  )
}
const Notification = (props) => {
  // Kiểm tra giá trị của props
  if (props.isShow) {
    // Trả về JSX để hiển thị
    return (
      <ul>
        <li>Thông báo 1</li>
        <li>Thông báo 2</li>
      </ul>
    )
  } else {
    // Trả về null để ẩn
    return null
  }      
}
// Component Con
const MyInput = React.forwardRef((props, ref)=>{
  return <input name={props.name} ref={ref}/>;      
})
const ComponentChau = (props) => {
  return <h1>Ông bảo cháu là "{props.message}"</h1>  
}
const ComponentCha = (props) => {
  return <ComponentChau {...props}/>
}
const MessageContext = React.createContext();
class ComponentSuToChau extends Component {
  render(){
      var myStyle = {
        fontSize: 80,
        fontFamily: 'Courier',
        color: '#003300'
      }
  return <div><h1>Sư tổ Ông bảo sư tổ cháu là: '{this.context}'</h1>
  <h2>Training Institutes <span style={myStyle}>{25+20}</span></h2>
  <p data-demoAttribute="demo">This website contains the best CS tutorials</p>
  </div>
  }
}
ComponentSuToChau.contextType = MessageContext;
// Khởi tạo một number
/**
 * 1. Khởi tạo object context bằng phương thức React.createContext(), sau đó sẽ nhận được 1 object bao gồm các thuộc tính quan trọng như
 * Provider và Consumer
 * 2. Sử dụng Provider bọc quanh các component và truyền giá trị vào props value
 * 3. Thêm Consumer vào bất cứ đâu mà bạn muốn chia sẻ context miễn là ở bên trong Provider, bạn có thể lấy giá trị của context thông qua props.children
 */
const NumberContext = React.createContext();
class UpdateNumber extends Component {
  render(){
    return (
      <button onClick={()=>{
        console.log(this.context.update())
      }}>Update Number</button>
    );
  }
}
UpdateNumber.contextType = NumberContext;
class ShowNumber extends Component {
  render() {
    return (
      <p>{this.context.number}</p>
    )
  }
}
ShowNumber.contextType = NumberContext;
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    }
    // Bind this
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }
  // Hàm này sẽ tăng giá trị của số
  increment() {
    this.setState({
      count: this.state.count+1
    })
  }
  // Hàm này sẽ giảm giá trị của số
  decrement() {
    this.setState({
      count: this.state.count-1
    })
  }
  render() {
    return <div>{
      // Trả về giá trị cho props render      
      this.props.render({
        count: this.state.count,
        increment: this.increment,
        decrement: this.decrement     
      })
    }</div>;
  }
}
// Xây dựng HOC
/**
 * Đây được gọi là 1 HOC, nó nhận vào 1 component và trả ra 1 component
 */
const withHoverOpacity = (ImageComponent)=>{
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        opacity: 1
      }
      // Bind this
      this.onMouseLeave = this.onMouseLeave.bind(this);
      this.onMouseEnter = this.onMouseEnter.bind(this);
    }
    // Được gọi khi chuột được rời đi
    onMouseLeave() {
      this.setState({
        opacity: 1
      })
    }
    // Được gọi khi chuột được đi vào
    onMouseEnter() {
      this.setState({
        opacity: 0.5
      })
    }
    render() {
      return (
        <>
        <div style={{opacity:this.state.opacity}}
        onMouseLeave={this.onMouseLeave}
        onMouseEnter={this.onMouseEnter}
        >
          <ImageComponent></ImageComponent>
        </div>
        </>
      )
    }
  }
}
// Các component là các ảnh cần hover
const Image1 = (props) => {
  return <img src="https://freetuts.net/public/logo/logo.png" alt="freetuts" />;
}
const Image2 = (props) => {
  return <img src="https://facebookbrand.com/wp-content/uploads/2019/04/f_logo_RGB-Hex-Blue_512.png?w=512&h=512" alt="facebook" />;
}
// Lúc này mình truyền vào HOC 1 component và mình sẽ nhận vào 1 component mới
// Ở đây mình có thể hiển thị rất nhiều ảnh mà không cần phải xây dựng component hỗ trợ việc làm mờ ảnh quá nhiều
const ImageWithHoverOpacity1 = withHoverOpacity(Image1);
const ImageWithHoverOpacity2 = withHoverOpacity(Image2);
class App extends Component {
  constructor(props) {
    super(props);
    // Chỉ định một state
    this.state = {
      website:'freetuts.net', index: 1, isShow: true,
      textareaChange: '', buttonClick: '', mouseOver: '',
      // Khởi tạo state chứa giá trị của input
      email: '',
      password: '',
      isShowNotification: false,
      usd: 0,
      vnd: 0,
      number: 0
    }
    // Bind this cho function mouseOver để tránh gặp lỗi không tồn tại biến this
    this.mouseOver = this.mouseOver.bind(this)
    console.log(this.state.website)
    this.myRef = React.createRef();
  }
  handleClick = () => {
    this.myRef.current.focus();
  }
  handleChange=(data)=>{
    this.setState(data);
  }
  changeText(e) {
    this.setState({
      textareaChange: e.target.value  
    });
  }
  mouseOver() {
    this.setState({
      mouseOver: this.state.mouseOver + "mouseOver..."      
    });
  }
  toggleMSG() {
    this.setState({
      isShow: !this.state.isShow
    });
  }
  changeColor() {
    var title = document.getElementById("title");
    ReactDOM.findDOMNode(title).style.color="red";
    this.setState({
      website: 'Freetuts.net New'
    });
  }
  countDown() {
    this.setState({
      index: this.state.index - 1
    });
  }
  countUp() {
    this.setState((prevState, props)=>{ // props có trong component
      return {
        index: prevState.index + 1
      }        
    });
  }
  changeInputValue(e) {
    this.setState({
      [e.target.name]: e.target.value      
    });
  }
  validateForm() {
    let returnData = {
      error: false,
      msg: ''
    }
    const {email, password} = this.state
    // Kiểm tra email
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      returnData = {
        error: true,
        msg: 'Không đúng định dạng email'
      }
    }
    // Kiểm tra password
    if (password.length < 8) {
      returnData = {
        error: true,
        msg: 'Mật khẩu phải lớn hơn 8 ký tự'
      }
    }
    return returnData;
  }
  submitForm(e) {
    // Chặn các event mặc định của form
    e.preventDefault();
    // Gọi hàm validationForm() dùng để kiểm tra form
    const validation = this.validateForm();
    // Kiểm tra lỗi của input trong form và hiển thị
    if (validation.error)
      alert(validation.msg)
    else 
      alert('Submit form success')
  }
  updateNumber = () => {
    this.setState({
      number: Math.random()
    });
  }
  render(){
    const {number1,number2,name}=this.props
    const {isShowNotification}=this.state
    // Component Cha
    let ref = React.createRef();
    const handleButton = () => {
      ref.current.focus();
    }
    const message = 'Vào freetuts.net học lập trình';
    const myGirlFriends = [
      {
        id: 1,
        name: "Khanh Huyen",
        email: "khanhhuyen123@freetuts.net"
      },
      {
        id: 2,
        name: "Nguyen Hang",
        email: "nguyenhang3dzas@freetuts.net"
      },
      {
        id: 3,
        name: "Pham Uyen",
        email: "phamuyen@freetuts.net"
      }
    ];
    /**
     * Component này có nhiệm vụ lấy giá trị của props listGirlFriends sau đó sẽ dùng map để render lần lượt từng người và trả về cho props children giá trị của người hiện tại.
     * Sau đó chúng ta chỉ cần gọi component ShowGirlFriends ở bất cứ đâu bạn muốn nó hiển thị
     */
    const ShowGirlFriends = (props) => {
      return (
        <ul>
          {props.listGirlFriends.map((person, index)=>{
            props.children(person);
            return <li key={person.id}>{person.name}</li>;
          })}
        </ul>
      )
    }
    return(
      <React.Fragment>
      <Students/>
    <div className="App">
      <ImageWithHoverOpacity1/>
      <ImageWithHoverOpacity2/>
      <Counter render={(data)=>{
        //Nhận giá trị trả về từ Counter qua props render
        const {count,increment,decrement}=data; //data=props
        return(
          <>
          <p>Giá trị {count}</p>
          <button onClick={increment}>Tăng</button>
          <button onClick={decrement}>Giảm</button>
          </>
        )
      }}></Counter>
      <ShowGirlFriends listGirlFriends={myGirlFriends}>
        {(data)=>{
          console.log(data);
        }}
      </ShowGirlFriends>
      <NumberContext.Provider value={{
        number: this.state.number,
        update: this.updateNumber.bind(this)
      }}>
        <NumberContext.Consumer>
          {()=>(
            <>
            <ShowNumber/>
            <UpdateNumber/>
            </>
          )}
        </NumberContext.Consumer>
      </NumberContext.Provider>
      <MessageContext.Provider value="Mày có vào học không thằng ôn con">
        <ComponentSuToChau/>
      </MessageContext.Provider>
      <ComponentCha message={message}/>
      <MyInput name="email" ref={ref}/>
      <button onClick={handleButton}>Focus Input</button>
      <input name="email" onChange={this.onChange} ref={this.myRef} type="text"/>
      <button onClick={this.handleClick}>Focus Input</button>
      <USDtoVND onHandleChange={this.handleChange} value={this.state.usd}/>
      <VNDtoUSD onHandleChange={this.handleChange} value={this.state.vnd}/>
      <hr/>
      <List/>
      <div style={{margin:20}}>
        <p>freetuts.net - lập trình ReactJS</p>
        <button onClick={()=>{
            // Cập nhật lại state
            this.setState({
              isShowNotification: !isShowNotification              
            })
        }}>{isShowNotification?'Ẩn':'Hiển thị'}</button>
        {/** Gọi component Notification */}
        <Notification isShow={isShowNotification}/>
      </div>
      <div className="container" style={{paddingTop:"5%"}}>
        <form onSubmit={e=>{this.submitForm(e);}}>
          <div className="form-group">
            <label htmlFor="text">Email:</label>
            <input type="text" className="form-control" name="email" placeholder="Enter email"
            onChange={e=>this.changeInputValue(e)}/>
          </div>
          <div className="form-group">
            <label htmlFor="pwd">Password:</label>
            <input type="password" className="form-control" name="password" placeholder="Enter password"
            onChange={e=>this.changeInputValue(e)}/>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
      <div style={{marginTop:"5%"}}>
        <button onClick={()=>{this.setState({
          buttonClick: this.state.buttonClick + "onClick..."
        })}}>click me..</button>{" "}
        <p>
          Button: <code>{this.state.buttonClick}</code>
        </p>
        <hr/>
        <textarea onChange={e=>this.changeText(e)} placeholder="Nhập cái gì đó..."></textarea>    
        <p>
          Textarea: <code>{this.state.textareaChange}</code>
        </p>
        <hr/>
        <h6 onMouseOver={this.mouseOver}>Di chuột vào đây nè</h6>
        <p>
          MouseOver: <code>{this.state.mouseOver}</code>
        </p>
      </div>
      <b>Nội dung : {this.state.isShow?'Freetuts.net - Lập trình ReactJS':''}</b><br/>
      <button onClick={()=>this.toggleMSG()}>
        {this.state.isShow?"HIDE":"SHOW"}
      </button>
      <h1 id="title">Tiêu đề</h1>
      <button onClick={this.changeColor.bind(this)}>Change Color</button>
      <p>Giá trị: {Math.random()}</p>
      <button onClick={()=>this.forceUpdate()}>Reload</button>
      <p>Giá trị: {this.state.index}</p>
      <button onClick={()=>this.countDown()}>Down</button>
      <button onClick={()=>this.countUp()}>Up</button>
      <h1>{this.props.name}</h1>
      <ul>
        <li>{this.props.type}</li>
        <li>{this.props.public_year}</li>
        <li>{this.props.storage}</li>
      </ul>
      <h1>{number1}+{number2}={number1+number2}</h1>
      <p>Giá trị {this.state.index}</p>
      <button onClick={()=>{this.setState({index:this.state.index+1})}}>Tăng</button>
      <button onClick={()=>{this.setState({index:this.state.index-1})}}>Giảm</button>
      <div>
        <Clothes name="Quần jean" type="Skinny" color="Đen" size="L">Clothes 1</Clothes>
        <Clothes name="Váy" type="Váy công chúa" color="Trắng" size="M">Clothes 2</Clothes>
      </div>
    <div>
      <Welcome/>
      <p>{this.state.website}</p>
    </div>
    <h1>Hello React.js</h1>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    </React.Fragment>
    )
  }
}
// Đúng kiểu dữ liệu
App.defaultProps = {
  name: 'iPhone Xs Max',
  type: 'iPhone',
  public_year: 2018,
  storage: '64 GB'
}
App.defaultProps = {
  name: 'iPad Mini 2019',
  type: 'iPad',
  public_year: 2019,
  storage: 64
}
// Sai kiểu dữ liệu vì type phải là các giá trị như iPhone, iPad, Mac, SmartWatch
App.defaultProps = {
  name: 'Airpod 2',
  type: 'Airpod',
  public_year: 2019
}
//Chỉ định props mặc định: number1, number2 là kiểu int
App.defaultProps = {
  number1: 4,
  number2: 2,
  name: 'iPad Mini 2019',
  type: 'iPad',
  public_year: 2019,
  storage: 64
}
// Kiểm tra dữ liệu sử dụng PropTypes
App.propTypes = {
  number1: PropTypes.number,
  number2: PropTypes.number,
  name: PropTypes.string,
  type: PropTypes.oneOf(['iPhone', 'iPad', 'Mac', 'SmartWatch']),
  public_year: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}
export default App;
