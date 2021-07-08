import React, { Component } from "react";
const myList_0 = ['php', 'javascript', 'python', 'C++'];
const listItems_0 = myList_0.map((item)=><li>{item}</li>);
const myList_1 = [
    {
        id: 'p',
        name: 'php'
    },
    {
        id: 'j',
        name: 'javascript'
    },
    {
        id: 'py',
        name: 'python'
    },
    {
        id: 'c',
        name: 'c++'
    }
]
const listItems_1 = myList_1.map((item)=><li key={item.id}>{item.name}</li>);
class List extends Component {
    render(){
        return(
            <div>
                <ul>{listItems_0}</ul>
                <ul>{listItems_1}</ul>
            </div>
        )
    }
}
export default List