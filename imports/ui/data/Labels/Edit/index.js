import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

import Data from './Data.js';
import LoadModal from './LoadModal.js';
import LoadSnackbar from './LoadSnackbar.js';
import Notifications from './Notifications.js';
import Verification from './Verification.js';

import RefreshSnackbar from './RefreshSnackbar/index.js';

class LabelsEdit extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { loadModal } = this.props;
        return (
            <div>
                <Data />
                <Verification />
                <RefreshSnackbar />
                {loadModal &&
                <LoadModal />
                }
                {!loadModal &&
                <LoadSnackbar />
                }
                <Notifications />
            </div>
        );
    }
}

LabelsEdit.propTypes = {

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(LabelsEdit);
