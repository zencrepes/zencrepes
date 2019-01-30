import React, { Component } from 'react';
import PropTypes from "prop-types";

import Notifications from './Notifications.js';
import LoadModal from './LoadModal.js';
import LoadSnackbar from './LoadSnackbar.js';
import {connect} from "react-redux";

class Loading extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { loading, loadingModal, cancelLoading } = this.props;
        if (loading === true) {
            return (
                <React.Fragment>
                    <Notifications />
                    {loadingModal ? (
                        <LoadModal
                            cancelLoading={cancelLoading}
                        />
                    ) : (
                        <LoadSnackbar
                            cancelLoading={cancelLoading}
                        />
                    )}
                </React.Fragment>
            );
        } else {
            return (
                <Notifications />
            );
        }
    }
}

Loading.propTypes = {
    loadingModal: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,

    cancelLoading: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    cancelLoading: dispatch.global.cancelLoading,
});

const mapState = state => ({
    loadingModal: state.global.loadingModal,
    loading: state.global.loading,
});

export default connect(mapState, mapDispatch)(Loading);
