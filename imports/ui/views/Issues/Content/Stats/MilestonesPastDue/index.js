import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import IssuesTree from '../../../../../components/Charts/Nivo/IssuesTree.js';

import {connect} from "react-redux";

class MilestonesPopulated extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { statsMilestonesPastDue, defaultPoints } = this.props;
        return (
            <CustomCard
                headerTitle="Milestones past due"
                headerFactTitle=""
                headerFactValue={statsMilestonesPastDue.length}
                headerLegend="Those milestones have a due date located in the past but still contain issues with an OPEN state. Associated issues should either be closed or moved to a future Milestone."
            >
                {statsMilestonesPastDue.length > 0 ? (
                    <IssuesTree
                        dataset={statsMilestonesPastDue}
                        defaultPoints={defaultPoints}
                        emptyName="Milestones Past Due"
                    />
                ): (
                    <span>No data available</span>
                )}

            </CustomCard>
        );
    }
}

MilestonesPopulated.propTypes = {
    statsMilestonesPastDue: PropTypes.array.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
};

const mapState = state => ({
    statsMilestonesPastDue: state.issuesView.statsMilestonesPastDue,
    defaultPoints: state.issuesView.defaultPoints,
});

export default connect(mapState, null)(MilestonesPopulated);
