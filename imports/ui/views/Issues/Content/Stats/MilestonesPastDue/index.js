import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import MsTreemap from './MsTreemap.js';
import {connect} from "react-redux";

class MilestonesPopulated extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { statsMilestonesPastDue, setUpdateQueryPath, setUpdateQuery } = this.props;
        return (
            <CustomCard
                headerTitle="Milestones past due"
                headerFactTitle=""
                headerFactValue={statsMilestonesPastDue.length}
                headerLegend="Those milestones have a due date located in the past but still contain issues with an OPEN state. Associated issues should either be closed or moved to a future Milestone."
            >
                {statsMilestonesPastDue.length > 0 ? (
                    <MsTreemap
                        dataset={statsMilestonesPastDue}
                        setUpdateQueryPath={setUpdateQueryPath}
                        setUpdateQuery={setUpdateQuery}
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
    setUpdateQueryPath: PropTypes.func.isRequired,
    setUpdateQuery: PropTypes.func.isRequired,
};

const mapState = state => ({
    statsMilestonesPastDue: state.issuesView.statsMilestonesPastDue,
});

const mapDispatch = dispatch => ({
    setUpdateQueryPath: dispatch.global.setUpdateQueryPath,
    setUpdateQuery: dispatch.global.setUpdateQuery,
});

export default connect(mapState, mapDispatch)(MilestonesPopulated);
