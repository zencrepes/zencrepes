import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";

import {buildMongoSelector} from "../../utils/mongo";
import {cfgIssues} from "../../data/Minimongo";

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

    refreshFull = () => {
        const { setLoadFlag, setLoadRepos } = this.props;
        setLoadRepos([]);
        setLoadFlag(true);
    };

    refreshQuick = () => {
        console.log('refreshQuick');
        const { setLoadFlag, setLoadRepos, filters } = this.props;
        //Get list of repositories for current query
        let mongoSelector = buildMongoSelector(filters);
        let openedIssuesFilter = {...mongoSelector, ...{'state':{$in:['OPEN']}}};
        let reposGroup = Object.keys(_.groupBy(cfgIssues.find(openedIssuesFilter).fetch(), 'repo.id'));
        setLoadRepos(reposGroup);
        setLoadFlag(true);
    };

    render() {
        const { classes, loading } = this.props;

        return (
            <div className={classes.root}>
                {!loading &&
                    <div>
                        <Button variant="raised" color="primary" className={classes.button} onClick={this.refreshFull}>
                            All Repos
                        </Button>
                        <Button variant="raised" color="primary" className={classes.button} onClick={this.refreshQuick}>
                            Selected Repos
                        </Button>
                    </div>
                }
            </div>
        )
    };
}

Refresh.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    loading: state.issuesFetch.loading,
    loadSuccess: state.issuesFetch.loadSuccess,

    filters: state.queries.filters,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.issuesFetch.setLoadFlag,
    setLoading: dispatch.issuesFetch.setLoading,

    setLoadSuccess: dispatch.issuesFetch.setLoadSuccess,
    setLoadRepos: dispatch.issuesFetch.setLoadRepos,
});


export default connect(mapState, mapDispatch)(withStyles(styles)(Refresh));
