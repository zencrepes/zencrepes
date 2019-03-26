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
        const {
            reposSetLoadFlag,
            reposSetLoadRepos,
            setOnSuccess,
            projectsUpdateView
        } = this.props;
        setOnSuccess(projectsUpdateView);
        reposSetLoadRepos([]);
        reposSetLoadFlag(true);
        this.setState({ anchorEl: null });
    };

    refreshSelectedRepos = () => {
        const {
            reposSetLoadFlag,
            reposSetLoadRepos,
            projects,
            setOnSuccess,
            projectsUpdateView
        } = this.props;

        const allRepos = _.uniqBy(projects.map(project => project.repo), 'id');
        //Get list of repositories for current query
        setOnSuccess(projectsUpdateView);
        reposSetLoadRepos(allRepos.map(r => r.id));
        reposSetLoadFlag(true);
        this.setState({ anchorEl: null });
    };

    refreshProjects = () => {
        const {
            projectsSetStageFlag,
            projectsSetVerifFlag,
            projectsSetProjects,
            projectsSetAction,
            projects,
            setOnSuccess,
            projectsUpdateView
        } = this.props;
        setOnSuccess(projectsUpdateView);
        projectsSetProjects(projects);
        projectsSetAction('refresh');
        projectsSetStageFlag(false);
        projectsSetVerifFlag(true);
        this.setState({ anchorEl: null });
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes, projects } = this.props;
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
                    Load Projects
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.refreshAllRepos}>Across all Repositories</MenuItem>
                    <MenuItem
                        onClick={this.refreshSelectedRepos}
                        disabled={projects.length === 0 ? true : false}
                    >
                        Across selected Repositories
                    </MenuItem>
                    <MenuItem
                        onClick={this.refreshProjects}
                        disabled={projects.length === 0 ? true : false}
                    >
                        Displayed Projects
                    </MenuItem>
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

    projects: PropTypes.array.isRequired,
    projectsSetStageFlag: PropTypes.func.isRequired,
    projectsSetVerifFlag: PropTypes.func.isRequired,
    projectsSetProjects: PropTypes.func.isRequired,
    projectsSetAction: PropTypes.func.isRequired,
    projectsUpdateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    projects: state.projectsView.projects,
});

const mapDispatch = dispatch => ({
    reposSetLoadFlag: dispatch.projectsFetch.setLoadFlag,
    reposSetLoadRepos: dispatch.projectsFetch.setLoadRepos,

    projectsSetStageFlag: dispatch.projectsEdit.setStageFlag,
    projectsSetVerifFlag: dispatch.projectsEdit.setVerifFlag,
    projectsSetProjects: dispatch.projectsEdit.setProjects,
    projectsSetAction: dispatch.projectsEdit.setAction,
    projectsUpdateView: dispatch.projectsView.updateView,

    setOnSuccess: dispatch.loading.setOnSuccess,

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Refresh));
