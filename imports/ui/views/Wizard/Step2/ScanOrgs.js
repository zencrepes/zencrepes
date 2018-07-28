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
    }

    componentDidMount() {
        console.log('componentDidMount');
        const { setLoadFlag } = this.props;
        if (cfgSources.find({}).count() === 0) {
            setLoadFlag(true);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loadSuccess, setLoadSuccess } = this.props;
        if (prevProps.loadSuccess === false && loadSuccess === true) {
            //Set timer to actually set back success to false (and remove snackbar)
            setTimeout(() => {
                setLoadSuccess(false);
            }, 2000);
        }
    };

    reloadRepos = () => {
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    };

    render() {
        const { classes, loading, loadSuccess, loadedOrgs, loadedRepos } = this.props;
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
                        message={<span id="message-id">Found {loadedRepos} repositories amongst {loadedOrgs} GitHub organizations</span>}
                    />
                </div>
            );
        }
    }
}

ScanOrgs.propTypes = {
    classes: PropTypes.object,
    loading: PropTypes.bool,
    loadSuccess: PropTypes.bool,
    loadedOrgs: PropTypes.number,
    loadedRepos: PropTypes.number,
    setLoadFlag: PropTypes.func,
    setLoadSuccess: PropTypes.func,
};

const mapState = state => ({
    loading: state.githubFetchOrgs.loading,
    loadSuccess: state.githubFetchOrgs.loadSuccess,
    loadedOrgs: state.githubFetchOrgs.loadedOrgs,
    loadedRepos: state.githubFetchOrgs.loadedRepos,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchOrgs.setLoadFlag,
    setLoadSuccess: dispatch.githubFetchOrgs.setLoadSuccess,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ScanOrgs));