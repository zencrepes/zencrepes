import React, { Component } from 'react';

import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

import {Redirect} from "react-router-dom";

class Index extends Component {
    render() {
        return (
            <Redirect to="/issues" />
        );
    }
}
export default Index;