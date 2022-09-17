import React from 'react';
class Students extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'ReactJS',
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
            ],
            displayBio: false
        }
        console.log('Component this', this);
        this.toggleDisplayBio = this.toggleDisplayBio.bind(this);
    }
    toggleDisplayBio() {
        this.setState({displayBio: !this.state.displayBio});
    }
    render() {
        return (
            <div style={{textAlign:'center'}}>
                <JAV javProp = {this.state.name}/>
                <h4>Student Name Detail</h4>
                {
                    this.state.displayBio ? (
                        <div>
                            <p><h4>Javatpoint is one of the best Java training institute in Noida, Delhi, Gurugram, Ghaziabad and Faridabad. We have a team of experienced Java developers and trainers from multinational companies to teach our campus students.</h4></p>                
                            <button onClick={this.toggleDisplayBio}>Show Less</button>
                        </div>                        
                    ) : (
                        <div>
                            <button onClick={this.toggleDisplayBio}>Read More</button>
                        </div>
                    )
                }
                <ul>
                    {this.state.data.map((item) => <li style={{listStyle:'none'}}>{item.name}</li>)}
                </ul>
            </div>
        );
    }
}
class JAV extends React.Component {
    render() {
        return (
            <div>
                <h1>State & Props Example</h1>
                <h3>Welcome to {this.props.javProp}</h3>
                <p>Javatpoint is one of the best Java training institute in Noida, Delhi, Gurugram, Ghaziabad and Faridabad.</p>  
            </div>
        )
    }
}
export default Students;