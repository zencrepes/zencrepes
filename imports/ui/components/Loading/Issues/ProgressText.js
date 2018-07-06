import React from 'react';
import PropTypes from 'prop-types';

import { connect } from "react-redux";

import { withStyles } from '@material-ui/core/styles';
import DialogContentText from '@material-ui/core/DialogContentText';

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: 600,
    }
});

class ProgressText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { classes } = this.props;
        return (
            <DialogContentText id="alert-dialog-description">
                Issues (Total / Loaded): {this.props.issuesTotalCount} / {this.props.issuesLoadedCount} <br />
                Labels (Total / Loaded): {this.props.labelsTotalCount} / {this.props.labelsLoadedCount} <br />
            </DialogContentText>
        );
    }
}

ProgressText.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});

const mapState = state => ({
    totalOrgs: state.github.totalOrgs,
    totalRepos: state.github.totalRepos,
    totalIssues: state.github.totalIssues,
    totalLabels: state.github.totalLabels,
    selectedOrgs: state.github.selectedOrgs,
    selectedRepos: state.github.selectedRepos,
    selectedIssues: state.github.selectedIssues,
    selectedLabels: state.github.selectedLabels,
    loadedOrgs: state.github.loadedOrgs,
    loadedRepos: state.github.loadedRepos,
    loadedIssues: state.github.loadedIssues,
    loadedLabels: state.github.loadedLabels,

    issuesLoadedCount: state.githubIssues.loadedCount,
    labelsLoadedCount: state.githubLabels.loadedCount,
    issuesTotalCount: state.githubIssues.totalCount,
    labelsTotalCount: state.githubLabels.totalCount,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ProgressText));

