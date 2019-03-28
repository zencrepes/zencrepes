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
        const { reposSetLoadFlag, reposSetLoadRepos, setOnSuccess, pullrequestsUpdateView  } = this.props;
        setOnSuccess(pullrequestsUpdateView);
        reposSetLoadRepos([]);
        reposSetLoadFlag(true);
        this.setState({ anchorEl: null });
    };

    refreshSelectedRepos = () => {
        const { reposSetLoadFlag, reposSetLoadRepos, pullrequests, setOnSuccess, pullrequestsUpdateView } = this.props;

        const allRepos = _.uniqBy(pullrequests.map(pullrequest => pullrequest.repo), 'id');
        //Get list of repositories for current query
        setOnSuccess(pullrequestsUpdateView);
        reposSetLoadRepos(allRepos);
        reposSetLoadFlag(true);
        this.setState({ anchorEl: null });
    };

    refreshPullrequests = () => {
        const {
            pullrequestsSetStageFlag,
            pullrequestsSetVerifFlag,
            pullrequestsSetPullrequests,
            pullrequestsSetAction,
            pullrequests,
            setOnSuccess,
            pullrequestsUpdateView
        } = this.props;
        setOnSuccess(pullrequestsUpdateView);
        pullrequestsSetPullrequests(pullrequests);
        pullrequestsSetAction('refresh');
        pullrequestsSetStageFlag(false);
        pullrequestsSetVerifFlag(true);
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
                    Refresh Pullrequests
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.refreshAllRepos}>Across all Repositories</MenuItem>
                    <MenuItem onClick={this.refreshSelectedRepos}>Across selected Repositories</MenuItem>
                    <MenuItem onClick={this.refreshPullrequests}>Filtered Pullrequests</MenuItem>
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

    pullrequests: PropTypes.array.isRequired,
    pullrequestsSetStageFlag: PropTypes.func.isRequired,
    pullrequestsSetVerifFlag: PropTypes.func.isRequired,
    pullrequestsSetPullrequests: PropTypes.func.isRequired,
    pullrequestsSetAction: PropTypes.func.isRequired,
    pullrequestsUpdateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    pullrequests: state.pullrequestsView.pullrequests,
});

const mapDispatch = dispatch => ({
    reposSetLoadFlag: dispatch.pullrequestsFetch.setLoadFlag,
    reposSetLoadRepos: dispatch.pullrequestsFetch.setLoadRepos,

    pullrequestsSetStageFlag: dispatch.pullrequestsEdit.setStageFlag,
    pullrequestsSetVerifFlag: dispatch.pullrequestsEdit.setVerifFlag,
    pullrequestsSetPullrequests: dispatch.pullrequestsEdit.setPullrequests,
    pullrequestsSetAction: dispatch.pullrequestsEdit.setAction,
    pullrequestsUpdateView: dispatch.pullrequestsView.updateView,

    loading: dispatch.loading.setOnSuccess,
    setOnSuccess: dispatch.loading.setOnSuccess,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Refresh));
