import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

import Data from './Data.js';
import LoadModal from './LoadModal.js';
import LoadSnackbar from './LoadSnackbar.js';
import Notifications from './Notifications.js';

class MilestonesEdit extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { loadModal } = this.props;
        return (
            <div>
                <Data />
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

MilestonesEdit.propTypes = {

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(MilestonesEdit);