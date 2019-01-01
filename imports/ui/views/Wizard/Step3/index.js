import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Grid from '@material-ui/core/Grid';

import Refresh from './Refresh.js';
import IssuesRepartition from './IssuesRepartition.js';
import PropTypes from "prop-types";

import IssuesFetch from '../../../data/Issues/Fetch/index.js';

import LoadDialog from './LoadDialog/index.js';
import { cfgIssues } from "../../../data/Minimongo";

class Step3 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { issues } = this.props;
        return (
            <div>
                <IssuesFetch />
                {issues.length === 0 &&
                    <LoadDialog />
                }
                <p>
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
    issues: PropTypes.array.isRequired,
};

export default withTracker(() => {return {
            issues: cfgIssues.find({}).fetch(),
        }})(Step3);
