import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter, Link } from 'react-router-dom';

import PropTypes from "prop-types";

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import styles from './styles.jsx';

import General from '../../layouts/General/index.js';

import IssuesFacets from './Facets/index.js';
import IssuesQuery from './Query/index.js';
import IssuesTabs from './Tabs/index.js';
import IssuesContent from './Content/index.js';

class Issues extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { initIssues } = this.props;
        initIssues();
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <General>
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
            </div>
        );
    }
}

Issues.propTypes = {
    classes: PropTypes.object,

};

const mapDispatch = dispatch => ({
    initIssues: dispatch.issuesView.initIssues,
});

export default connect(null, mapDispatch)(withRouter(withStyles(styles)(Issues)));
