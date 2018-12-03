import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {connect} from "react-redux";

const styles = theme => ({
    root: {
    },
});

class RemoveButton extends Component {
    constructor (props) {
        super(props);
    }

    remove = () => {
        const { milestone, milestones, setMilestones, verifiedMilestones, setVerifiedMilestones } = this.props;
        setMilestones(
            milestones.filter(ms => ms.id !== milestone.id)
        );
        setVerifiedMilestones(
            verifiedMilestones.filter(ms => ms.id !== milestone.id)
        );
    };

    render() {
        const { classes } = this.props;
        return (
            <IconButton aria-label="Delete" className={classes.margin} onClick={this.remove}>
                <DeleteIcon fontSize="small" />
            </IconButton>
        );
    }
}

RemoveButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    verifiedMilestones: state.milestonesEdit.verifiedMilestones,
    milestones: state.milestonesEdit.milestones,
});

const mapDispatch = dispatch => ({
    setMilestones: dispatch.milestonesEdit.setMilestones,
    setVerifiedMilestones: dispatch.milestonesEdit.setVerifiedMilestones,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(RemoveButton));
