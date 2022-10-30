import React, {FunctionComponent} from "react";
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
const FunctionExample = ({name = "Function Component", age = 1, showMessage}) => {
    return (
        <div>
            <h2>Name: {name}</h2>
            <p>Age: {age}</p>
            <button onClick={()=>showMessage("Tus")}>Action</button>
        </div>
    )
}
export default FunctionExample;
