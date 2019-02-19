import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

class EmptyActions extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <AppBar position="static" color="primary">
                <Toolbar />
            </AppBar>
        );
    }
}

export default EmptyActions;
