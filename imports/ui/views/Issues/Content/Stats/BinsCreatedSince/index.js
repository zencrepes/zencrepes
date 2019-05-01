import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import StatsBinBar from '../../../../../components/Charts/Highcharts/StatsBinBar.js';
import {connect} from "react-redux";

class BinsCreatedSince extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { statsCreatedSince } = this.props;
        return (
            <CustomCard
                headerTitle="Still open after"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Issues with an OPEN state, amount of time since they were created."
            >
                {statsCreatedSince.length > 0 ? (
                    <StatsBinBar
                        dataset={statsCreatedSince}
                    />
                ): (
                    <span>No data available</span>
                )}
            </CustomCard>
        );
    }
}

BinsCreatedSince.propTypes = {
    statsCreatedSince: PropTypes.array.isRequired,
};

const mapState = state => ({
    statsCreatedSince: state.issuesView.statsCreatedSince,
});

export default connect(mapState, null)(BinsCreatedSince);
