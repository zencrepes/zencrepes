import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";

import LoadMessage from './LoadMessage.js';

class RefreshSnackbar extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { verifying, verifyingMsg, verifFlag } = this.props;

        if (verifFlag === false && verifying) {
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
        } else {
            return null;
        }
    }
}

RefreshSnackbar.propTypes = {
    verifying: PropTypes.bool.isRequired,
    verifFlag: PropTypes.bool.isRequired,
    verifyingMsg: PropTypes.string.isRequired,
};

const mapState = state => ({
    verifying: state.milestonesEdit.verifying,
    verifFlag: state.milestonesEdit.verifFlag,
    verifyingMsg: state.milestonesEdit.verifyingMsg,
});

export default connect(mapState, null)(RefreshSnackbar);
