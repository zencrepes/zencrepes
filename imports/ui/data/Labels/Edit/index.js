import React, { Component } from 'react';

import Data from './Data.js';
import LoadModal from './LoadModal.js';
import LoadSnackbar from './LoadSnackbar.js';
import Notifications from './Notifications.js';
import Stage from './Stage/index.js';
import Staging from './Stage/Staging.js';

import RefreshSnackbar from './RefreshSnackbar/index.js';
import PropTypes from "prop-types";

class LabelsEdit extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { loadModal } = this.props;
        return (
            <div>
                <Data />
                <Stage />
                <Staging />
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
    loadModal: PropTypes.bool,
};

export default LabelsEdit;
