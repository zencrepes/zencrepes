import _ from 'lodash';
import React, { Component } from 'react';
import {connect} from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from "prop-types";

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';

import ProgressBar from '../../../components/Loading/Issues/ProgressBar.js';
import ProgressText from '../../../components/Loading/Issues/ProgressText.js';

const styles = theme => ({
    root: {
    },
    loading: {
        flexGrow: 1,
    },
});

class LoadContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    loadIssues = () => {
        console.log('loadIssues');
        const { setIssuesLoadFlag, setLabelsLoadFlag } = this.props;
        setIssuesLoadFlag(true);
        setLabelsLoadFlag(true);
    };

    cancelLoad = () => {
        console.log('cancelLoad');
        this.props.setIssuesLoading(false);
        this.props.setLabelsLoading(false);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loadSuccess, setLoadSuccess } = this.props;
        if (prevProps.loadSuccess === false && loadSuccess === true) {
            //Set timer to actually set back success to false (and remove snackbar)
            setTimeout(() => {
                setLoadSuccess(false);
            }, 2000);
        }
    };

    render() {
        const { classes, issuesLoading, labelsLoading, loadError, loadSuccess, loadedOrgs, loadedRepos } = this.props;
        if (issuesLoading || labelsLoading) {
            return (
                <div className={classes.loading}>
                    <ProgressBar />
                    <ProgressText />
                    <Button onClick={this.cancelLoad} color="primary" autoFocus>
                        Cancel Load
                    </Button>
                </div>
            );
        } else {
            return (
                <div className={classes.root}>
                    <Button color="primary" className={classes.button} onClick={this.loadIssues}>
                        BIG LOAD BUTTON
                    </Button>
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
                        open={loadSuccess}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">Found {loadedRepos} repositories amongst {loadedOrgs} GitHub organizations</span>}
                    />
                </div>
            );
        }
    }
}

LoadContent.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    issuesLoading: state.githubIssues.loading,
    labelsLoading: state.githubLabels.loading,
    loadError: state.githubFetchOrgs.loadError,
    loadSuccess: state.githubFetchOrgs.loadSuccess,
    loadedOrgs: state.githubFetchOrgs.loadedOrgs,
    loadedRepos: state.githubFetchOrgs.loadedRepos,
});

const mapDispatch = dispatch => ({
    setIssuesLoadFlag: dispatch.githubIssues.setLoadFlag,
    setLabelsLoadFlag: dispatch.githubLabels.setLoadFlag,

    setIssuesLoading: dispatch.githubIssues.setLoading,
    setLabelsLoading: dispatch.githubLabels.setLoading,

    setLoadSuccess: dispatch.githubFetchOrgs.setLoadSuccess,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(LoadContent));