import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

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
            <React.Fragment>
                <IssuesFetch />
                {issues.length === 0 &&
                    <LoadDialog />
                }
                <Refresh/>
                <IssuesRepartition issues={issues}/>
            </React.Fragment>
        );
    }
}

Step3.propTypes = {
    issues: PropTypes.array.isRequired,
};

export default withTracker(() => {return {
            issues: cfgIssues.find({}).fetch(),
        }})(Step3);
