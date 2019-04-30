import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
//import PieChart from '../../../../../components/Charts/PieChart.js';
import IssuesPie from '../../../../../components/Charts/ChartJS/IssuesPie.js';
import {connect} from "react-redux";

class ProjectsPopulated extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { statsProjectsCount } = this.props;
        return (
            <CustomCard
                headerTitle="Projects"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Display the number of issues (not points) with the field populated or not"
            >
                {statsProjectsCount.length > 0 ? (
                    <IssuesPie
                        dataset={statsProjectsCount}
                    />

                ): (
                    <span>No data available</span>
                )}
            </CustomCard>
        );
    }
}

ProjectsPopulated.propTypes = {
    statsProjectsCount: PropTypes.array.isRequired,
};

const mapState = state => ({
    statsProjectsCount: state.issuesView.statsProjectsCount,
});

export default connect(mapState, null)(ProjectsPopulated);
