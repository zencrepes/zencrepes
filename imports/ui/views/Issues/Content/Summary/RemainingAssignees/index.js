import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";

import CustomCard from "../../../../../components/CustomCard/index.js";
import IssuesTree from "../../../../../components/Charts/Nivo/IssuesTree.js";

class RemainingByAssignee extends Component {
    constructor (props) {
        super(props);
    }

    // Since an issue could have multiple assignees, we can't rely on the aggregate to calculate total points or issues,
    // using remainingWorkRepos instead
    getDefaultRemaining() {
        const { defaultPoints, remainingWorkRepos } = this.props;
        if (defaultPoints) {
            return remainingWorkRepos.map(r => r.points).reduce((acc, points) => acc + points, 0);
        } else {
            return remainingWorkRepos.map(r => r.issues.length).reduce((acc, count) => acc + count, 0);
        }
    }

    getDefaultRemainingTxt() {
        const { defaultPoints } = this.props;
        if (defaultPoints) {
            return 'Points';
        } else {
            return 'Issues';
        }
    }
    getDefaultRemainingTxtShrt() {
        const { defaultPoints } = this.props;
        if (defaultPoints) {
            return 'Pts';
        } else {
            return 'Tkts';
        }
    }

    render() {
        const { defaultPoints, remainingWorkAssignees  } = this.props;
        return (
            <CustomCard
                headerTitle="Remaining by Assignee"
                headerFactTitle={"Remaining " + this.getDefaultRemainingTxt()}
                headerFactValue={this.getDefaultRemaining() + " " + this.getDefaultRemainingTxtShrt()}
            >
                <IssuesTree
                    dataset={remainingWorkAssignees}
                    defaultPoints={defaultPoints}
                    emptyName="Repositories"
                />
            </CustomCard>
        );
    }
}

RemainingByAssignee.propTypes = {
    defaultPoints: PropTypes.bool.isRequired,
    remainingWorkAssignees: PropTypes.array.isRequired,
    remainingWorkRepos: PropTypes.array.isRequired,
};

const mapState = state => ({
    defaultPoints: state.issuesView.defaultPoints,
    remainingWorkAssignees: state.issuesView.remainingWorkAssignees,
    remainingWorkRepos: state.issuesView.remainingWorkRepos,
});

export default connect(mapState, null)(RemainingByAssignee);
