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
        const { reposSetLoadFlag, reposSetLoadRepos, reposSetOnSuccess, labelsUpdateView  } = this.props;
        reposSetOnSuccess(labelsUpdateView);
        reposSetLoadRepos([]);
        reposSetLoadFlag(true);
        this.setState({ anchorEl: null });
    };

    refreshSelectedRepos = () => {
        const { reposSetLoadFlag, reposSetLoadRepos, labels, reposSetOnSuccess, labelsUpdateView } = this.props;

        const allRepos = _.uniqBy(labels.map(label => label.repo), 'id');
        //Get list of repositories for current query
        reposSetOnSuccess(labelsUpdateView);
        reposSetLoadRepos(allRepos);
        reposSetLoadFlag(true);
        this.setState({ anchorEl: null });
    };

    refreshLabels = () => {
        const { labelsSetStageFlag, labelsSetVerifFlag, labelsSetLabels, labelsSetAction, labels, labelsSetOnSuccess, labelsUpdateView, labelsSetVerifying } = this.props;
        labelsSetOnSuccess(labelsUpdateView);
        labelsSetLabels(labels);
        labelsSetAction('refresh');
        labelsSetVerifying(true);
        labelsSetStageFlag(false);
        labelsSetVerifFlag(true);
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
                    Refresh Labels
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.refreshAllRepos}>Across all Repositories</MenuItem>
                    <MenuItem onClick={this.refreshSelectedRepos}>Across selected Repositories</MenuItem>
                    <MenuItem onClick={this.refreshLabels}>Filtered Labels</MenuItem>
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

    labels: PropTypes.array.isRequired,
    labelsSetStageFlag: PropTypes.func.isRequired,
    labelsSetVerifFlag: PropTypes.func.isRequired,
    labelsSetVerifying: PropTypes.func.isRequired,
    labelsSetLabels: PropTypes.func.isRequired,
    labelsSetAction: PropTypes.func.isRequired,
    labelsSetOnSuccess: PropTypes.func.isRequired,
    labelsUpdateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    labels: state.labelsView.labels,
});

const mapDispatch = dispatch => ({
    reposSetLoadFlag: dispatch.labelsFetch.setLoadFlag,
    reposSetLoadRepos: dispatch.labelsFetch.setLoadRepos,
    reposSetOnSuccess: dispatch.labelsFetch.setOnSuccess,

    labelsSetStageFlag: dispatch.labelsEdit.setStageFlag,
    labelsSetVerifFlag: dispatch.labelsEdit.setVerifFlag,
    labelsSetVerifying: dispatch.labelsEdit.setVerifying,
    labelsSetLabels: dispatch.labelsEdit.setLabels,
    labelsSetAction: dispatch.labelsEdit.setAction,
    labelsSetOnSuccess: dispatch.labelsEdit.setOnSuccess,
    labelsUpdateView: dispatch.labelsView.updateView,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Refresh));
