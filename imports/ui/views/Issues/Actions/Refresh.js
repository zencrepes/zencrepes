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
        const { reposSetLoadFlag, reposSetLoadRepos, setOnSuccess, issuesUpdateView  } = this.props;
        setOnSuccess(issuesUpdateView);
        reposSetLoadRepos([]);
        reposSetLoadFlag(true);
        this.setState({ anchorEl: null });
    };

    refreshSelectedRepos = () => {
        const { reposSetLoadFlag, reposSetLoadRepos, issues, setOnSuccess, issuesUpdateView } = this.props;

        const allRepos = _.uniqBy(issues.map(issue => issue.repo), 'id');
        //Get list of repositories for current query
        setOnSuccess(issuesUpdateView);
        reposSetLoadRepos(allRepos);
        reposSetLoadFlag(true);
        this.setState({ anchorEl: null });
    };

    refreshIssues = () => {
        const {
            issuesSetStageFlag,
            issuesSetVerifFlag,
            issuesSetIssues,
            issuesSetAction,
            issues,
            setOnSuccess,
            issuesUpdateView
        } = this.props;
        setOnSuccess(issuesUpdateView);
        issuesSetIssues(issues);
        issuesSetAction('refresh');
        issuesSetStageFlag(false);
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
                    Refresh Issues
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.refreshAllRepos}>Across all Repositories</MenuItem>
                    <MenuItem onClick={this.refreshIssues}>Filtered Issues</MenuItem>
                </Menu>
            </div>
        )
    }
}

Refresh.propTypes = {
    classes: PropTypes.object.isRequired,
    reposSetLoadFlag: PropTypes.func.isRequired,
    reposSetLoadRepos: PropTypes.func.isRequired,

    setOnSuccess: PropTypes.func.isRequired,

    issues: PropTypes.array.isRequired,
    issuesSetStageFlag: PropTypes.func.isRequired,
    issuesSetVerifFlag: PropTypes.func.isRequired,
    issuesSetIssues: PropTypes.func.isRequired,
    issuesSetAction: PropTypes.func.isRequired,
    issuesUpdateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    issues: state.issuesView.issues,
});

const mapDispatch = dispatch => ({
    reposSetLoadFlag: dispatch.issuesFetch.setLoadFlag,
    reposSetLoadRepos: dispatch.issuesFetch.setLoadRepos,

    issuesSetStageFlag: dispatch.issuesEdit.setStageFlag,
    issuesSetVerifFlag: dispatch.issuesEdit.setVerifFlag,
    issuesSetIssues: dispatch.issuesEdit.setIssues,
    issuesSetAction: dispatch.issuesEdit.setAction,
    issuesUpdateView: dispatch.issuesView.updateView,

    loading: dispatch.loading.setOnSuccess,
    setOnSuccess: dispatch.loading.setOnSuccess,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Refresh));
