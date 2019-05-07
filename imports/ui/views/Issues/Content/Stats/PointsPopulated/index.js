import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import IssuesPie from '../../../../../components/Charts/ChartJS/IssuesPie.js';

import {connect} from "react-redux";

class PointsPopulated extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { statsPointsCount } = this.props;
        return (
            <CustomCard
                headerTitle="LOE"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Display the number of issues (not points) with the field populated or not"
            >
                {statsPointsCount.length > 0 ? (
                    <IssuesPie
                        dataset={statsPointsCount}
                    />
                ): (
                    <span>No data available</span>
                )}
            </CustomCard>
        );
    }
}

PointsPopulated.propTypes = {
    statsPointsCount: PropTypes.array.isRequired,
};

const mapState = state => ({
    statsPointsCount: state.issuesView.statsPointsCount,
});

export default connect(mapState, null)(PointsPopulated);

