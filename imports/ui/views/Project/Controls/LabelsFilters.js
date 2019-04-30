import React, { Component } from 'react';
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import Grid from '@material-ui/core/Grid';

import IssueLink from '../../../components/Links/IssueLink/index.js';

const styles = {
    root: {
        textAlign: 'right'
    },
};
class GitHubActivity extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, projectsIssues } = this.props;

        return (
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={8}
            >
                <Grid item xs={12} sm container>
                        <span>GitHub Activity:</span>
                </Grid>
                <Grid item>
                    <div className={classes.root}>
                        {projectsIssues.map(issue => (
                            <IssueLink key={issue.id} issue={issue} />
                        ))}
                        {projectsIssues.length === 0 &&
                            <span>No issues with the Activity label found</span>
                        }
                    </div>
                </Grid>
            </Grid>
        );
    }
}

GitHubActivity.propTypes = {
    classes: PropTypes.object.isRequired,
    projectsIssues: PropTypes.array.isRequired,
};

const mapState = state => ({
    projectsIssues: state.projectView.projectsIssues,
});

export default connect(mapState, null)(withStyles(styles)(GitHubActivity));