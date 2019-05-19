import React, { Component } from 'react';

import PropTypes from "prop-types";

import CustomCard from "../../../components/CustomCard/index.js";
import IssuesTree from "../../../components/Charts/Nivo/IssuesTree.js";

import {connect} from "react-redux";

class RemainingPoints extends Component {
    constructor(props) {
        super(props);
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
        const { assignees, issues, defaultPoints } = this.props;

        let metric = 'points';
        if (!defaultPoints) {metric = 'issues';}

        let openPoints = issues
            .filter(issue => issue.state === 'OPEN')
            .map(issue => issue.points)
            .reduce((acc, points) => acc + points, 0);

        if (!defaultPoints) {
            openPoints = issues.filter(issue => issue.state === 'OPEN').length;
        }

        const repartitionAssignees = assignees.map((assignee) => {
            let name = assignee.login;
            if (assignee.name !== undefined && assignee.name !== '' && assignee.name !== null) {name = assignee.name;}
            return {
                name: name,
                count: assignee.issues.list.length,
                points: assignee.issues.points,
                issues: assignee.issues.list,
            }
        });


        return (
            <CustomCard
                headerTitle="Remaining by Assignee"
                headerFactTitle={"Remaining " + metric}
                headerFactValue={openPoints + " " + this.getDefaultRemainingTxtShrt()}
            >
                {openPoints > 0 ? (
                    <IssuesTree
                        dataset={repartitionAssignees}
                        defaultPoints={defaultPoints}
                        emptyName="Assignees"
                    />
                ) : (
                    <span>Data not available, try switching to issues count instead.</span>
                )}

            </CustomCard>
        );
    }
}

RemainingPoints.propTypes = {
    assignees: PropTypes.array.isRequired,
    issues: PropTypes.array.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
};

const mapState = state => ({
    issues: state.projectView.issues,
    assignees: state.projectView.assignees,
    defaultPoints: state.projectView.defaultPoints,
});

export default connect(mapState, null)(RemainingPoints);
