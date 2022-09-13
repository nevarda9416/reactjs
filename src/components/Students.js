import React from 'react';
class Students extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [
                {
                    "name": "Abhishek"
                },
                {
                    "name": "Saharsh"
                },
                {
                    "name": "Ajay"
                },
            ]
        }
    }
    render() {
        return (
            <div style={{textAlign:'center'}}>
                <h4>Student Name Detail</h4>
                <ul>
                    {this.state.data.map((item) => <li style={{listStyle:'none'}}>{item.name}</li>)}
                </ul>
            </div>
        );
    }
}
export default Students;