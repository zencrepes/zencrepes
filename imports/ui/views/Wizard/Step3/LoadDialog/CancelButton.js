import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import {connect} from "react-redux";

const styles = theme => ({
    root: {

    },
});

class CancelButton extends Component {
    constructor (props) {
        super(props);
    }

    cancel = () => {
        const { changeActiveStep } = this.props;
        changeActiveStep(1);
    };

    render() {
        const { classes } = this.props;
        return (
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={this.cancel}
            >
                Cancel
            </Button>
        );
    }
}

CancelButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
});

const mapDispatch = dispatch => ({
    changeActiveStep: dispatch.wizardView.changeActiveStep,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(CancelButton));