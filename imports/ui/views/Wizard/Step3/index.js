import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import { withTracker } from 'meteor/react-meteor-data';

import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';

import Refresh from './Refresh.js';
import IssuesRepartition from './IssuesRepartition.js';
import PropTypes from "prop-types";

import IssuesFetch from '../../../data/Issues/Fetch/index.js';

import LoadDialog from './LoadDialog/index.js';
import { cfgIssues } from "../../../data/Minimongo";

const styles = theme => ({
    root: {
    },
});

class Step3 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, issues } = this.props;
        return (
            <div>
                <IssuesFetch />
                {issues.length === 0 &&
                    <LoadDialog />
                }
                <p className={classes.paragraph}>
                    This screen provides a breakdown of open issues per repositories. It gets automatically updated as data loads.
                </p>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item>
                        <Refresh/>
                    </Grid>
                    <Grid item xs={12} sm container>
                        <IssuesRepartition issues={issues}/>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

Step3.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
});

const mapDispatch = dispatch => ({
});

export default
    connect(mapState, null)
    (
        withTracker(() => {return {
            issues: cfgIssues.find({}).fetch(),
        }})
        (
            withStyles(styles)(Step3)
        )
    );
