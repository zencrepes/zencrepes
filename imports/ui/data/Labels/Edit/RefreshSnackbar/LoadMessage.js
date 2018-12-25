import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';

class LoadMessage extends Component {
    constructor (props) {
        super(props);
    }

    cancelLoad = () => {
        console.log('cancelLoad');
        const { setVerifying } = this.props;
        setVerifying(false);
    };

    render() {
        const { message } = this.props;
        return (
            <React.Fragment>
                <span id="message-id">{message}</span>
                <IconButton aria-label="Delete" onClick={this.cancelLoad}>
                    <CancelIcon fontSize="small" color="disabled" />
                </IconButton>
            </React.Fragment>
        );
    }
}

LoadMessage.propTypes = {
    setVerifying: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
};

const mapDispatch = dispatch => ({
    setVerifying: dispatch.labelsEdit.setVerifying,
});

export default connect(null, mapDispatch)(LoadMessage);
