import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import RefreshIcon from '@material-ui/icons/Refresh';
import {connect} from "react-redux";

import AutoRefresh from './AutoRefresh.js';

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
        const { reposSetLoadFlag, reposSetLoadRepos, reposSetOnSuccess, sprintsUpdateView  } = this.props;
        reposSetOnSuccess(sprintsUpdateView);
        reposSetLoadRepos([]);
        reposSetLoadFlag(true);
        this.setState({ anchorEl: null });
    };

    refreshSelectedRepos = () => {
        const { reposSetLoadFlag, reposSetLoadRepos, milestones, reposSetOnSuccess, sprintsUpdateView } = this.props;

        reposSetOnSuccess(sprintsUpdateView);
        reposSetLoadRepos(milestones.map(milestone => milestone.repo.id));
        reposSetLoadFlag(true);
        this.setState({ anchorEl: null });
    };

    autoRefresh = () => {
        const {
            autoRefreshEnable,
            setAutoRefreshEnable,
            setAutoRefreshTimer,
            setAutoRefreshCount,
            autoRefreshDefaultTimer,
        } = this.props;
        if (autoRefreshEnable === true) {
            setAutoRefreshEnable(false);
            setAutoRefreshTimer(autoRefreshDefaultTimer);
            setAutoRefreshCount(0);
        } else {
            setAutoRefreshEnable(true);
        }

        this.setState({ anchorEl: null });
    };

    refreshIssues = () => {
        const { issuesSetStageFlag, issuesSetVerifFlag, issuesSetIssues, issuesSetAction, issues, issuesSetOnSuccess, sprintsUpdateView, issuesSetVerifying } = this.props;
        issuesSetOnSuccess(sprintsUpdateView);
        issuesSetIssues(issues);
        issuesSetAction('refresh');
        issuesSetVerifying(true);
        issuesSetStageFlag(true);
        issuesSetVerifFlag(true);
        this.setState({ anchorEl: null });
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes, autoRefreshEnable, autoRefreshTimer, loading } = this.props;
        const { anchorEl } = this.state;

        return (
            <div className={classes.root}>
                <AutoRefresh />
                <Button
                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    disabled={loading}
                    className={classes.button}
                >
                    <RefreshIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                    {autoRefreshEnable ? (
                        <React.Fragment>
                            Refresh (in {autoRefreshTimer}s)
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            Refresh
                        </React.Fragment>
                    )}
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.refreshSelectedRepos}>Refresh</MenuItem>
                    <MenuItem onClick={this.autoRefresh}>Turn {autoRefreshEnable ? 'off' : 'on'} Auto-Refresh</MenuItem>
                </Menu>
            </div>
        )
    }
}

Refresh.propTypes = {
    classes: PropTypes.object.isRequired,
    autoRefreshEnable: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    autoRefreshTimer: PropTypes.number.isRequired,
    autoRefreshDefaultTimer: PropTypes.number.isRequired,

    reposSetLoadFlag: PropTypes.func.isRequired,
    reposSetLoadRepos: PropTypes.func.isRequired,
    reposSetOnSuccess: PropTypes.func.isRequired,

    issues: PropTypes.array.isRequired,
    milestones: PropTypes.array.isRequired,
    issuesSetStageFlag: PropTypes.func.isRequired,
    issuesSetVerifFlag: PropTypes.func.isRequired,
    issuesSetVerifying: PropTypes.func.isRequired,
    issuesSetIssues: PropTypes.func.isRequired,
    issuesSetAction: PropTypes.func.isRequired,
    issuesSetOnSuccess: PropTypes.func.isRequired,
    sprintsUpdateView: PropTypes.func.isRequired,

    setAutoRefreshEnable: PropTypes.func.isRequired,
    setAutoRefreshTimer: PropTypes.func.isRequired,
    setAutoRefreshCount: PropTypes.func.isRequired,
};

const mapState = state => ({
    issues: state.sprintsView.issues,
    milestones: state.sprintsView.milestones,
    repositories: state.sprintsView.repositories,

    autoRefreshEnable: state.sprintsView.autoRefreshEnable,
    autoRefreshTimer: state.sprintsView.autoRefreshTimer,
    autoRefreshDefaultTimer: state.sprintsView.autoRefreshDefaultTimer,

    loading: state.loading.loading,
});

const mapDispatch = dispatch => ({
    reposSetLoadFlag: dispatch.issuesFetch.setLoadFlag,
    reposSetLoadRepos: dispatch.issuesFetch.setLoadRepos,
    reposSetOnSuccess: dispatch.issuesFetch.setOnSuccess,

    issuesSetStageFlag: dispatch.issuesEdit.setStageFlag,
    issuesSetVerifFlag: dispatch.issuesEdit.setVerifFlag,
    issuesSetVerifying: dispatch.issuesEdit.setVerifying,
    issuesSetIssues: dispatch.issuesEdit.setIssues,
    issuesSetAction: dispatch.issuesEdit.setAction,
    issuesSetOnSuccess: dispatch.issuesEdit.setOnSuccess,

    sprintsUpdateView: dispatch.sprintsView.updateView,

    setAutoRefreshEnable: dispatch.sprintsView.setAutoRefreshEnable,
    setAutoRefreshTimer: dispatch.sprintsView.setAutoRefreshTimer,
    setAutoRefreshCount: dispatch.sprintsView.setAutoRefreshCount,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Refresh));
