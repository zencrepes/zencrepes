import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
//import PieChart from '../../../../../components/Charts/PieChart.js';
import IssuesPie from '../../../../../components/Charts/ChartJS/IssuesPie.js';

import {connect} from "react-redux";

class AssigneesPopulated extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { statsAssigneesCount } = this.props;
        return (
            <CustomCard
                headerTitle="Assignees"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Display the number of issues (not points) with the field populated or not"
            >
                {statsAssigneesCount.length > 0 ? (
                    <IssuesPie
                        dataset={statsAssigneesCount}
                    />
                ): (
                    <span>No data available</span>
                )}

            </CustomCard>
        );
    }
}

AssigneesPopulated.propTypes = {
    statsAssigneesCount: PropTypes.array.isRequired,
};

const mapState = state => ({
    statsAssigneesCount: state.issuesView.statsAssigneesCount,
});

export default connect(mapState, null)(AssigneesPopulated);