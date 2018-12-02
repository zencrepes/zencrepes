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

class ApplyButton extends Component {
    constructor (props) {
        super(props);
    }

    apply = () => {
        const { setLoadFlag, setStageFlag } = this.props;
        setStageFlag(false);
        setLoadFlag(true);
    };

    render() {
        const { classes, verifiedMilestones, milestones } = this.props;

        //The apply button is disabled until all milestones have been verified in GitHub and no errors have been found
        return (
            <Button
                variant="raised"
                color="primary"
                disabled={verifiedMilestones.filter(milestone => milestone.error === false).length !== milestones.length}
                className={classes.button}
                onClick={this.apply}
            >
                Apply
            </Button>
        );
    }
}

ApplyButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    verifiedMilestones: state.milestonesEdit.verifiedMilestones,
    milestones: state.milestonesEdit.milestones,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.milestonesEdit.setLoadFlag,
    setStageFlag: dispatch.milestonesEdit.setMilestones,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ApplyButton));