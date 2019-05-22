import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import General from '../../layouts/General/index.js';

import IssuesFetch from '../../data/Issues/Fetch/index.js';
import IssuesEdit from '../../data/Issues/Edit/index.js';
import IssuesCreate from '../../data/Issues/Create/index.js';

import Actions from './Actions/index.js';
import IssuesFacets from './Facets/index.js';
import IssuesQuery from './Query/index.js';
import IssuesTabs from './Tabs/index.js';
import IssuesContent from './Content/index.js';

import IssuesImport from './Import/index.js';

import NoData from './NoData/index.js';

import QueryUpdate from '../../components/Links/QueryUpdate/index.js';

const style = {
    root: {
        marginRight: '10px'
    },
    fullWidth :{
        width: '100%',
    }
};

class Issues extends Component {
    constructor(props) {
        super(props);
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    componentDidMount() {
        const { updateQuery, updateSelectedTab, match } = this.props;
        const params = new URLSearchParams(this.props.location.search);
        if (params.get('q') !== null) {
            const queryUrl = decodeURIComponent(params.get('q'));
            updateQuery(JSON.parse(queryUrl));
        } else {
            updateQuery({});
        }
        if (match.params.tab !== undefined) {
            updateSelectedTab(match.params.tab);
        }
    }

    componentDidUpdate(prevProps) {
        const { updateQuery, updateSelectedTab, match } = this.props;
        const params = new URLSearchParams(this.props.location.search);
        const queryUrl = decodeURIComponent(params.get('q'));

        const oldParams = new URLSearchParams(prevProps.location.search);
        const oldQueryUrl = decodeURIComponent(oldParams.get('q'));

        if (queryUrl !== oldQueryUrl) {
            updateQuery(JSON.parse(queryUrl));
        }
        if (match.params.tab !== undefined) {
            updateSelectedTab(match.params.tab);
        }
    }

    // Receive request to change tab, update URL accordingly
    changeTab = (newTab) => {
        const params = new URLSearchParams(this.props.location.search);
        let queryUrl = "{}";
        if (decodeURIComponent(params.get('q')) !== null) {
            queryUrl = decodeURIComponent(params.get('q'));
        }
        this.props.history.push({
            pathname: '/issues/' + newTab,
            search: '?q=' + encodeURIComponent(queryUrl),
            state: { detail: queryUrl }
        });
    };

    render() {
        const { classes, issues } = this.props;
        return (
            <General>
                <QueryUpdate />
                <IssuesImport />
                <IssuesFetch />
                <IssuesEdit />
                <IssuesCreate />
                {issues.length === 0 ? (
                    <NoData />
                ) : (
                    <React.Fragment>
                        <Actions />
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={8}
                        >
                            <Grid item >
                                <IssuesFacets />
                            </Grid>
                            <Grid item xs={12} sm container>
                                <Grid
                                    container
                                    direction="column"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                >
                                    <Grid item xs={12} sm className={classes.fullWidth}>
                                        <IssuesQuery />
                                    </Grid>
                                    <Grid item xs={12} sm className={classes.fullWidth}>
                                        <IssuesTabs changeTab={this.changeTab}/>
                                    </Grid>
                                    <Grid item xs={12} sm className={classes.fullWidth}>
                                        <IssuesContent />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                )}
            </General>
        );
    }
}

Issues.propTypes = {
    classes: PropTypes.object.isRequired,
    updateQuery: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    issues: PropTypes.array.isRequired,
    updateSelectedTab: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    updateQuery: dispatch.issuesView.updateQuery,
    updateSelectedTab: dispatch.issuesView.updateSelectedTab,
});

const mapState = state => ({
    issues: state.issuesView.issues,
});

export default connect(mapState, mapDispatch)(withRouter(withStyles(style)(Issues)));
