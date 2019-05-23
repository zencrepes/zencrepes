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

    refreshSelectedRepos = () => {
        const {
            reposSetLoadFlag,
            reposSetLoadRepos,
            projects,
            setOnSuccess,
            updateView
        } = this.props;
        setOnSuccess(updateView);
        reposSetLoadRepos(projects.map(project => project.repo.id));
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
    setOnSuccess: PropTypes.func.isRequired,

    issues: PropTypes.array.isRequired,
    projects: PropTypes.array.isRequired,
    updateView: PropTypes.func.isRequired,

    setAutoRefreshEnable: PropTypes.func.isRequired,
    setAutoRefreshTimer: PropTypes.func.isRequired,
    setAutoRefreshCount: PropTypes.func.isRequired,
};

const mapState = state => ({
    issues: state.projectView.issues,
    projects: state.projectView.projects,

    autoRefreshEnable: state.projectView.autoRefreshEnable,
    autoRefreshTimer: state.projectView.autoRefreshTimer,
    autoRefreshDefaultTimer: state.projectView.autoRefreshDefaultTimer,

    loading: state.loading.loading,
});

const mapDispatch = dispatch => ({
    reposSetLoadFlag: dispatch.issuesFetch.setLoadFlag,
    reposSetLoadRepos: dispatch.issuesFetch.setLoadRepos,

    updateView: dispatch.projectView.updateView,

    setAutoRefreshEnable: dispatch.projectView.setAutoRefreshEnable,
    setAutoRefreshTimer: dispatch.projectView.setAutoRefreshTimer,
    setAutoRefreshCount: dispatch.projectView.setAutoRefreshCount,

    setOnSuccess: dispatch.loading.setOnSuccess,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Refresh));
