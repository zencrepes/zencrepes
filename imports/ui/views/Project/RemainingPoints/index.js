import React, { Component } from 'react';

import PropTypes from "prop-types";

import CustomCard from "../../../components/CustomCard/index.js";
import ReposTreemap from './ReposTreemap.js';
import {connect} from "react-redux";

class RemainingPoints extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { assignees, issues } = this.props;

        const openPoints = issues
            .filter(issue => issue.state === 'OPEN')
            .map(issue => issue.points)
            .reduce((acc, points) => acc + points, 0);

        const repartitionAssignees = assignees.map((assignee) => {
            return {
                ...assignee,
                open: {
                    points: assignee.issues.list.filter(issue => issue.state === 'OPEN').map(issue => issue.points).reduce((acc, points) => acc + points, 0),
                    issues: assignee.issues.list.filter(issue => issue.state === 'OPEN').length,
                },
                closed: {
                    points: assignee.issues.list.filter(issue => issue.state === 'CLOSED').map(issue => issue.points).reduce((acc, points) => acc + points, 0),
                    issues: assignee.issues.list.filter(issue => issue.state === 'CLOSED').length,
                },
            }
        });
        return (
            <CustomCard
                headerTitle="Remaining by Assignee"
                headerFactTitle="Remaining points"
                headerFactValue={openPoints + " Pts"}
            >
                {openPoints > 0 ? (
                    <ReposTreemap
                        assignees={repartitionAssignees}
                    />
                ) : (
                    <span>All tickets closed</span>
                )}

            </CustomCard>
        );
    }
}

RemainingPoints.propTypes = {
    assignees: PropTypes.array.isRequired,
    issues: PropTypes.array.isRequired,
};

const mapState = state => ({
    issues: state.projectView.issues,
    assignees: state.projectView.assignees,
});

export default connect(mapState, null)(RemainingPoints);
