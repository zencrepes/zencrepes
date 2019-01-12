import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Refresh from './Refresh.js';

class Actions extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Refresh />
                </Toolbar>
            </AppBar>
        );
    }
}

export default Actions;
