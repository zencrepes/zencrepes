import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import StatsBinBar from '../../../../../components/Charts/Highcharts/StatsBinBarRepositories.js';
import {connect} from "react-redux";

class BinsLastUpdated extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { statsUpdatedSince } = this.props;
        return (
            <CustomCard
                headerTitle="Time since last update"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Amount of time since repository was last updated."
            >
                {statsUpdatedSince.length > 0 ? (
                    <StatsBinBar
                        dataset={statsUpdatedSince}
                    />
                ): (
                    <span>No data available</span>
                )}
            </CustomCard>
        );
    }
}

BinsLastUpdated.propTypes = {
    statsUpdatedSince: PropTypes.array.isRequired,
};

const mapState = state => ({
    statsUpdatedSince: state.repositoriesView.statsUpdatedSince,
});

export default connect(mapState, null)(BinsLastUpdated);
