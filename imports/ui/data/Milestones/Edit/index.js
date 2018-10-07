import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

import Data from './Data.js';
import LoadModal from './LoadModal.js';
import Notifications from './Notifications.js';
import Progress from './Progress.js';

class MilestonesEdit extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Data />
                <LoadModal />
                <Notifications />
                <Progress />
            </div>
        );
    }
}

MilestonesEdit.propTypes = {

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(MilestonesEdit);
