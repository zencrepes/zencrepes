import React, { Component } from 'react';

import Verification from './Verification.js';
import LoadSnackbar from './LoadSnackbar/index.js';
import Notifications from './Notifications.js';

class IssuesEdit extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Verification />
                <LoadSnackbar />
                <Notifications />
            </div>
        );
    }
}

IssuesEdit.propTypes = {

};

export default IssuesEdit;
