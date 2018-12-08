import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
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
        const { setStageFlag, setMilestones, onCancel } = this.props;
        setMilestones([]);
        setStageFlag(false);
        onCancel();
    };

    render() {
        const { classes } = this.props;

        //The apply button is disabled until all milestones have been verified in GitHub and no errors have been found
        return (
            <Button
                variant="raised"
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
    onCancel: state.milestonesEdit.onCancel,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.milestonesEdit.setStageFlag,
    setMilestones: dispatch.milestonesEdit.setMilestones,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(CancelButton));