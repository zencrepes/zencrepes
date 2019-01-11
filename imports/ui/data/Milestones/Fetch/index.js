import React, { Component } from 'react';

import PropTypes from "prop-types";

import Data from './Data.js';
import LoadModal from './LoadModal.js';
import LoadSnackbar from './LoadSnackbar.js';
import Notifications from './Notifications.js';

class MilestonesFetch extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { loadModal } = this.props;
        return (
            <div>
                <Data />
                <Notifications />
                {loadModal &&
                    <LoadModal />
                }
                {!loadModal &&
                    <LoadSnackbar />
                }
            </div>
        );
    }
}

MilestonesFetch.propTypes = {
    loadModal: PropTypes.bool,
};

export default MilestonesFetch;
