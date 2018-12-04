import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

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

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(IssuesEdit);
