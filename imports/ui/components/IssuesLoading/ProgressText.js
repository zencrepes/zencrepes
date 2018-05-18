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
                Orgs (Total / Selected / Loaded): {this.props.totalOrgs} / {this.props.selectedOrgs} / {this.props.loadedOrgs} <br />
                Repos (Total / Selected / Loaded): {this.props.totalRepos} / {this.props.selectedRepos} / {this.props.loadedRepos} <br />
                Issues (Total / Selected / Loaded): {this.props.totalIssues} / {this.props.selectedIssues} / {this.props.loadedIssues} <br />
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
    selectedOrgs: state.github.selectedOrgs,
    selectedRepos: state.github.selectedRepos,
    selectedIssues: state.github.selectedIssues,
    loadedOrgs: state.github.loadedOrgs,
    loadedRepos: state.github.loadedRepos,
    loadedIssues: state.github.loadedIssues,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ProgressText));

