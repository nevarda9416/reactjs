import React, {FunctionComponent} from "react";
import {BrowserRouter, Link, Routes, Route, NavLink, Prompt} from 'react-router-dom';
interface Props {
    showMessage?: any;
}
function FunctionDemo() {
    return (
        <div className="FunctionDemo">
            <h2>Function Demo!</h2>
        </div>
    );
}
const FunctionExample = ({name = "ClassExample Component", age = 18, showMessage}) => {
    return (
        <div>
            <BrowserRouter>
                <div>
                    <ul>
                        <li>
                            <Link to="/user">User</Link>
                        </li>
                        <li>                            
                            <NavLink exact style={{color:'red'}} to="/user">User</NavLink>
                        </li>
                        <li>                            
                            <NavLink exact activeClassName="myStyle" to="/user">User</NavLink>
                        </li>
                    </ul>
                    <Routes>
                        <Route exact path="/home"/>
                    </Routes>
                </div>
            </BrowserRouter>
            <h2>Name: {name}</h2>
            <p>Age: {age}</p>
            <button onClick={()=>showMessage("Tú")}>Action</button>
        </div>
    )
}
export default FunctionExample;
