import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
//import PieChart from '../../../../../components/Charts/PieChart.js';
import IssuesPie from '../../../../../components/Charts/ChartJS/IssuesPie.js';

import {connect} from "react-redux";

class MilestonesPopulated extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { statsMilestonesCount } = this.props;
        return (
            <CustomCard
                headerTitle="Milestones"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Display the number of issues (not points) with the field populated or not"
            >
                {statsMilestonesCount.length > 0 ? (
                    <IssuesPie
                        dataset={statsMilestonesCount}
                    />
                ): (
                    <span>No data available</span>
                )}
            </CustomCard>
        );
    }
}

MilestonesPopulated.propTypes = {
    statsMilestonesCount: PropTypes.array.isRequired,
};

const mapState = state => ({
    statsMilestonesCount: state.issuesView.statsMilestonesCount,
});

export default connect(mapState, null)(MilestonesPopulated);
