import React, { Component } from 'react';

import ReactDOM from 'react-dom';
import Button from 'material-ui/Button';
import {Redirect} from "react-router-dom";

class Index extends Component {
    render() {
        return (
            <Redirect to="/dashboard" />
        );
    }
}
export default Index;