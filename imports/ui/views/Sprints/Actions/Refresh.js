import React, { Component } from 'react';

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
                    Refresh
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.refreshAllRepos}>Across all Repositories</MenuItem>
                    <MenuItem onClick={this.refreshSelectedRepos}>Repositories in Sprint</MenuItem>
                    <MenuItem onClick={this.refreshIssues}>Issues in Sprint</MenuItem>
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

    issues: PropTypes.array.isRequired,
    milestones: PropTypes.array.isRequired,
    issuesSetStageFlag: PropTypes.func.isRequired,
    issuesSetVerifFlag: PropTypes.func.isRequired,
    issuesSetVerifying: PropTypes.func.isRequired,
    issuesSetIssues: PropTypes.func.isRequired,
    issuesSetAction: PropTypes.func.isRequired,
    issuesSetOnSuccess: PropTypes.func.isRequired,
    sprintsUpdateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    issues: state.sprintsView.issues,
    milestones: state.sprintsView.milestones,
    repositories: state.sprintsView.repositories,
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
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Refresh));
