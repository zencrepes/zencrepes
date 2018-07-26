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

import { cfgSources } from "../../../data/Minimongo.js";

const styles = theme => ({
    root: {
    },
    loading: {
        flexGrow: 1,
    },
});

class ScanOrgs extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        console.log('componentDidMount');
        const { setLoadFlag } = this.props;
        if (cfgSources.find({}).count() === 0) {
            setLoadFlag(true);
        }
    }

    reloadRepos = () => {
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    };

    render() {
        const { classes, loading, loadError, loadSuccess, loadedOrgs, loadedRepos } = this.props;
        if (loading) {
            return (
                <div className={classes.loading}>
                    <LinearProgress />
                    <Typography component="p">
                        Fetched {loadedOrgs} Organizations and {loadedRepos} Repositories from GitHub ...
                    </Typography>
                </div>
            );
        } else {
            return (
                <div className={classes.root}>
                    <Button color="primary" className={classes.button} onClick={this.reloadRepos}>
                        Scan All
                    </Button>
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
                        open={loadSuccess}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">Found {loadedRepos} repositories in {loadedOrgs} GitHub organizations</span>}
                    />
                </div>
            );
        }
    }
}

ScanOrgs.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    loading: state.githubFetchOrgs.loading,
    loadError: state.githubFetchOrgRepos.loadError,
    loadSuccess: state.githubFetchOrgRepos.loadSuccess,
    loadedOrgs: state.githubFetchOrgs.loadedOrgs,
    loadedRepos: state.githubFetchOrgs.loadedRepos,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchOrgs.setLoadFlag,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ScanOrgs));