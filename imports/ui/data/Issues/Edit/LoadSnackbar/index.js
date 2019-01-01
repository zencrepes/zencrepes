import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";

import LoadMessage from './LoadMessage.js';

class LoadSnackbar extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { verifying, verifyingMsg } = this.props;

        return (
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={verifying}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={
                    <LoadMessage
                        message={verifyingMsg}
                    />
                }
            />
        );
    }
}

LoadSnackbar.propTypes = {
    verifying: PropTypes.bool,
    verifyingMsg: PropTypes.string,
};

const mapState = state => ({
    verifying: state.issuesEdit.verifying,
    verifyingMsg: state.issuesEdit.verifyingMsg,
});

export default connect(mapState, null)(LoadSnackbar);
