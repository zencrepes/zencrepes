import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";

import {buildMongoSelector} from "../../../utils/mongo";
import {cfgIssues} from "../../../data/Minimongo";

import ProgressBar from "../../../components/Loading/Issues/ProgressBar";

const styles = theme => ({
    root: {
        textAlign: 'right'
    },
});
class Refresh extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    /*
    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loadSuccess, setLoadSuccess, loadedCount, setLoadedCount, updateAvailableSprints, updateSelectedSprint } = this.props;
        if (prevProps.loadSuccess === false && loadSuccess === true) {
            //Set timer to actually set back success to false (and remove snackbar)
            setTimeout(() => {
                setLoadSuccess(false);
                setLoadedCount(0);
            }, 2000);
            if (loadedCount > 0) {
                updateAvailableSprints();
                updateSelectedSprint(null);
            }
        }
    };
*/
    refreshRepos = () => {
        console.log('refreshQuick');
        const { setLoadFlag, setLoadRepos, repositories } = this.props;
        //Get list of repositories for current query
        console.log(repositories);
        setLoadRepos(repositories.map(repository => repository.id));
        setLoadFlag(true);

    };

    render() {
        const { classes, loading, loadSuccess, loadedCount, repositories } = this.props;

        if (repositories.length === 0) {
            return null;
        } else {
            return (
                <div className={classes.root}>
                    {!loading &&
                    <div>
                        <Button variant="raised" color="primary" className={classes.button} onClick={this.refreshRepos}>
                            Refresh Issues Repos
                        </Button>
                    </div>
                    }
                    {loading &&
                    <ProgressBar/>
                    }
                    <Snackbar
                        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                        open={loadSuccess}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">Loaded or updated {loadedCount} issues</span>}
                    />
                </div>
            )
        }
    };
}

Refresh.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    loading: state.issuesFetch.loading,
    loadSuccess: state.issuesFetch.loadSuccess,

    loadedCount: state.issuesFetch.loadedCount,

    repositories: state.sprintsView.repositories,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.issuesFetch.setLoadFlag,
    setLoading: dispatch.issuesFetch.setLoading,
    setIterateCurrent: dispatch.issuesFetch.setIterateCurrent,
    setLoadedCount: dispatch.issuesFetch.setLoadedCount,
    setLoading: dispatch.issuesFetch.setLoading,

    setLoadSuccess: dispatch.issuesFetch.setLoadSuccess,
    setLoadRepos: dispatch.issuesFetch.setLoadRepos,

    setLoadedCount: dispatch.issuesFetch.setLoadedCount,

    updateAvailableSprints: dispatch.sprintsView.updateAvailableSprints,
    updateSelectedSprint: dispatch.sprintsView.updateSelectedSprint,

});


export default connect(mapState, mapDispatch)(withStyles(styles)(Refresh));
