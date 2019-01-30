import React, { Component } from 'react';

import Snackbar from "@material-ui/core/Snackbar";

import LoadMessage from './LoadMessage.js';

class LoadSnackbar extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={true}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<LoadMessage />}
            />
        );
    }
}

export default LoadSnackbar;
