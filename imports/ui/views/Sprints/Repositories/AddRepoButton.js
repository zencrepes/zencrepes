import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import {connect} from "react-redux";

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';

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
class AddRepoButton extends Component {
    constructor (props) {
        super(props);
    }

    addRepo = () => {
        const {
            milestones,
            updateAvailableRepos,
            setOpenAddRepos,
            setAddReposSelected,
            setNewTitle,
            setNewDueOn,
            setNewState,
            setNewDescription,
        } = this.props;
        updateAvailableRepos(milestones);
        setNewTitle(milestones[0].title);
        setNewDueOn(milestones[0].dueOn);
        setNewState(milestones[0].state);
        setNewDescription(milestones[0].description);
        setAddReposSelected([]);
        setOpenAddRepos(true);
    };

    render() {
        const { milestones, classes } = this.props;
        if (milestones !== undefined && milestones.length > 0) {
            return (
                <Tooltip title="Add Milestones (or Sprint) to repositories">
                    <Button variant="contained" size="small" className={classes.button} onClick={this.addRepo}>
                        <CreateNewFolderIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                        Add Repository
                    </Button>
                </Tooltip>
            );
        } else {
            return null;
        }
    }
}

AddRepoButton.propTypes = {
    classes: PropTypes.object.isRequired,
    milestones: PropTypes.array,
    setOpenAddRepos: PropTypes.func.isRequired,
    setAddReposSelected: PropTypes.func.isRequired,
    updateAvailableRepos: PropTypes.func.isRequired,

    setNewTitle: PropTypes.func.isRequired,
    setNewDueOn: PropTypes.func.isRequired,
    setNewState: PropTypes.func.isRequired,
    setNewDescription: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    //setMilestones: dispatch.milestonesEdit.setMilestones,
    setOpenAddRepos: dispatch.milestonesEdit.setOpenAddRepos,
    setAddReposSelected: dispatch.milestonesEdit.setAddReposSelected,
    updateAvailableRepos: dispatch.milestonesEdit.updateAvailableRepos,
    setNewTitle: dispatch.milestonesEdit.setNewTitle,
    setNewDueOn: dispatch.milestonesEdit.setNewDueOn,
    setNewState: dispatch.milestonesEdit.setNewState,
    setNewDescription: dispatch.milestonesEdit.setNewDescription,
});

export default connect(null, mapDispatch)(withStyles(styles)(AddRepoButton));
