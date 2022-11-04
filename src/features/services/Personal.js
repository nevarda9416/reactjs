import React, { Component } from "react";
import axios from 'axios';

export default class Personal extends Component {
    state = {
        isVisible: true,
        persons: []
    }
    getData = () => {
        axios.get(`https://jsonplaceholder.typicode.com/users`)
            .then(res => {
                const persons = res.data;
                this.setState({ persons, isVisible: !this.state.isVisible });
            })
            .catch(error => console.log(error));
    }
    getList() {
        if (!this.state.isVisible) {
            return (
                <div>   
                    <ul>
                        {this.state.persons.map(person => <li>{person.name}</li>)}
                    </ul>
                    <button onClick={()=>this.getData()}>Hide data</button>
                </div>
            )        
        } else {
            return (
                <div>
                    <button onClick={()=>this.getData()}>Get data</button>
                </div>
            )   
        }
    }
    render() {
        return (
            this.getList()
        )      
    }
}