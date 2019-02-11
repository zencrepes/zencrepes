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
        const { loading, loadingModal, cancelLoading, loadingTitle } = this.props;
        if (loading === true) {
            return (
                <React.Fragment>
                    <Notifications />
                    {loadingModal ? (
                        <LoadModal
                            cancelLoading={cancelLoading}
                            loadingTitle={loadingTitle}
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
    loading: PropTypes.bool.isRequired,
    loadingModal: PropTypes.bool.isRequired,
    loadingTitle: PropTypes.string,
    cancelLoading: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    cancelLoading: dispatch.loading.cancelLoading,
});

const mapState = state => ({
    loadingModal: state.loading.loadingModal,
    loadingTitle: state.loading.loadingTitle,
    loading: state.loading.loading,
});

export default connect(mapState, mapDispatch)(Loading);
