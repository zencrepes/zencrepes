import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
    root: {
    },
});
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
        const { classes, message } = this.props;

        return (
            <div className={classes.root}>
                <span id="message-id">{message}</span>
                <IconButton aria-label="Delete" onClick={this.cancelLoad}>
                    <CancelIcon fontSize="small" color="disabled" />
                </IconButton>
            </div>
        );
    };
}

LoadMessage.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
});

const mapDispatch = dispatch => ({
    setVerifying: dispatch.milestonesEdit.setVerifying,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(LoadMessage));
