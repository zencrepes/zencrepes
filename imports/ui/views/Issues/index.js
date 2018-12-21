import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter, Link } from 'react-router-dom';

import PropTypes from "prop-types";

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import styles from './styles.jsx';

import General from '../../layouts/General/index.js';

import IssuesFetch from '../../data/Issues/Fetch/index.js';
import IssuesEdit from '../../data/Issues/Edit/index.js';

import Actions from './Actions/index.js';
import IssuesFacets from './Facets/index.js';
import IssuesQuery from './Query/index.js';
import IssuesTabs from './Tabs/index.js';
import IssuesContent from './Content/index.js';

class Issues extends Component {
    constructor(props) {
        super(props);
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    componentDidMount() {
        const { updateQuery } = this.props;
        const params = new URLSearchParams(this.props.location.search);
        const queryUrl = params.get('q');
        if (queryUrl === null) {
            updateQuery({});
        } else {
            updateQuery(JSON.parse(queryUrl));
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { updateQuery } = this.props;
        const params = new URLSearchParams(this.props.location.search);
        const queryUrl = params.get('q');

        const oldParams = new URLSearchParams(prevProps.location.search);
        const oldQueryUrl = oldParams.get('q');

        if (queryUrl !== oldQueryUrl) {
            updateQuery(JSON.parse(queryUrl));
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <General>
                <IssuesFetch />
                <IssuesEdit />
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
                                <IssuesTabs />
                            </Grid>
                            <Grid item xs={12} sm className={classes.fullWidth}>
                                <IssuesContent />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </General>
        );
    }
}

Issues.propTypes = {
    classes: PropTypes.object,

};

const mapDispatch = dispatch => ({
    updateQuery: dispatch.issuesView.updateQuery,
});

export default connect(null, mapDispatch)(withRouter(withStyles(styles)(Issues)));
