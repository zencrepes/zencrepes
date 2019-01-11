import React, { Component } from 'react';

import PropTypes from "prop-types";

import Data from './Data.js';
import LoadModal from './LoadModal.js';
import Stage from './Stage/index.js';
import LoadSnackbar from './LoadSnackbar.js';
import Notifications from './Notifications.js';

import RefreshSnackbar from './RefreshSnackbar/index.js';

class MilestonesCreate extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { loadModal } = this.props;
        return (
            <div>
                <Data />
                <RefreshSnackbar />
                <Stage />
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

MilestonesCreate.propTypes = {
    loadModal: PropTypes.bool,
};

export default MilestonesCreate;
