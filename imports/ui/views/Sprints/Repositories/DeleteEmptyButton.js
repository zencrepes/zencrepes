import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import {connect} from "react-redux";

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
});
class DeleteEmptyButton extends Component {
    constructor (props) {
        super(props);
    }

    getEmptyMilestones = () => {
        const { milestones } = this.props;
        return milestones.filter((mls) => {
            if (mls.issues.totalCount === 0  && mls.pullRequests.totalCount === 0) {
                return true;
            } else {
                return false;
            }
        });

    };

    remove = () => {
        const { setMilestones, setAction, setOnSuccess, updateView, setStageFlag, setVerifFlag} = this.props;
        setMilestones(this.getEmptyMilestones());
        setAction('delete');
        setOnSuccess(updateView);
        setStageFlag(true);
        setVerifFlag(true);
    };

    render() {
        const { classes } = this.props;
        const emptyMilestones = this.getEmptyMilestones();
        if (emptyMilestones.length > 0) {
            return (
                <Tooltip title="Delete empty milestones">
                    <Button variant="contained" size="small" className={classes.button} onClick={this.remove}>
                        <DeleteIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                        Delete Empty
                    </Button>
                </Tooltip>
            );
        } else {
            return null;
        }
    }
}

DeleteEmptyButton.propTypes = {
    classes: PropTypes.object.isRequired,
    milestones: PropTypes.array.isRequired,

    setMilestones: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    setVerifFlag: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setVerifFlag: dispatch.milestonesEdit.setVerifFlag,
    setAction: dispatch.milestonesEdit.setAction,
    setStageFlag: dispatch.milestonesEdit.setStageFlag,
    setMilestones: dispatch.milestonesEdit.setMilestones,

    setOnSuccess: dispatch.loading.setOnSuccess,

    updateView: dispatch.sprintsView.updateView,
});

export default connect(null, mapDispatch)(withStyles(styles)(DeleteEmptyButton));
