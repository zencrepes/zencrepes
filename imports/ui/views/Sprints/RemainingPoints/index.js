import React, { Component } from 'react';

import PropTypes from "prop-types";

import CustomCard from "../../../components/CustomCard/index.js";
import IssuesTree from "../../../components/Charts/Nivo/IssuesTree.js";
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
                headerTitle="Remaining"
                headerFactTitle="Remaining points"
                headerFactValue={openPoints + " Pts"}
            >
                {openPoints > 0 ? (
                    <IssuesTree
                        dataset={repartitionAssignees}
                        defaultPoints={true}
                        emptyName="Assignees"
                    />
                ) : (
                    <span>Data not available.</span>
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
    issues: state.sprintsView.issues,
    assignees: state.sprintsView.assignees,
});

export default connect(mapState, null)(RemainingPoints);