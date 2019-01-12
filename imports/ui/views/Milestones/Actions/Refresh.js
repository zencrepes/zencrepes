import React, { Component } from 'react';
import _ from 'lodash';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import RefreshIcon from '@material-ui/icons/Refresh';
import {connect} from "react-redux";

const styles = theme => ({
    root: {
    },
    button: {
        color: '#fff',
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
});
class Refresh extends Component {
    constructor (props) {
        super(props);
        this.state = {
            anchorEl: null,
        };
    }

    refreshAllRepos = () => {
        const { reposSetLoadFlag, reposSetLoadRepos, reposSetOnSuccess, milestonesUpdateView  } = this.props;
        reposSetOnSuccess(milestonesUpdateView);
        reposSetLoadRepos([]);
        reposSetLoadFlag(true);
        this.setState({ anchorEl: null });
    };

    refreshSelectedRepos = () => {
        const { reposSetLoadFlag, reposSetLoadRepos, milestones, reposSetOnSuccess, milestonesUpdateView } = this.props;

        const allRepos = _.uniqBy(milestones.map(label => label.repo), 'id');
        //Get list of repositories for current query
        reposSetOnSuccess(milestonesUpdateView);
        reposSetLoadRepos(allRepos);
        reposSetLoadFlag(true);
        this.setState({ anchorEl: null });
    };

    refreshMilestones = () => {
        const { milestonesSetStageFlag, milestonesSetVerifFlag, milestonesSetMilestones, milestonesSetAction, milestones, milestonesSetOnStagingSuccess, milestonesUpdateView, milestonesSetVerifying } = this.props;
        milestonesSetOnStagingSuccess(milestonesUpdateView);
        milestonesSetMilestones(milestones);
        milestonesSetAction('refresh');
        milestonesSetVerifying(true);
        milestonesSetStageFlag(false);
        milestonesSetVerifFlag(true);
        this.setState({ anchorEl: null });
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;

        return (
            <div className={classes.root}>
                <Button
                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    className={classes.button}
                >
                    <RefreshIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                    Refresh Milestones
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.refreshAllRepos}>Across all Repositories</MenuItem>
                    <MenuItem onClick={this.refreshSelectedRepos}>Across selected Repositories</MenuItem>
                    <MenuItem onClick={this.refreshMilestones}>Filtered Milestones</MenuItem>
                </Menu>
            </div>
        )
    }
}

Refresh.propTypes = {
    classes: PropTypes.object.isRequired,
    reposSetLoadFlag: PropTypes.func.isRequired,
    reposSetLoadRepos: PropTypes.func.isRequired,
    reposSetOnSuccess: PropTypes.func.isRequired,

    milestones: PropTypes.array.isRequired,
    milestonesSetStageFlag: PropTypes.func.isRequired,
    milestonesSetVerifFlag: PropTypes.func.isRequired,
    milestonesSetVerifying: PropTypes.func.isRequired,
    milestonesSetMilestones: PropTypes.func.isRequired,
    milestonesSetAction: PropTypes.func.isRequired,
    milestonesSetOnStagingSuccess: PropTypes.func.isRequired,
    milestonesUpdateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    milestones: state.milestonesView.milestones,
});

const mapDispatch = dispatch => ({
    reposSetLoadFlag: dispatch.milestonesFetch.setLoadFlag,
    reposSetLoadRepos: dispatch.milestonesFetch.setLoadRepos,
    reposSetOnSuccess: dispatch.milestonesFetch.setOnSuccess,

    milestonesSetStageFlag: dispatch.milestonesEdit.setStageFlag,
    milestonesSetVerifFlag: dispatch.milestonesEdit.setVerifFlag,
    milestonesSetVerifying: dispatch.milestonesEdit.setVerifying,
    milestonesSetMilestones: dispatch.milestonesEdit.setMilestones,
    milestonesSetAction: dispatch.milestonesEdit.setAction,
    milestonesSetOnStagingSuccess: dispatch.milestonesEdit.setOnStagingSuccess,
    milestonesUpdateView: dispatch.milestonesView.updateView,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Refresh));
