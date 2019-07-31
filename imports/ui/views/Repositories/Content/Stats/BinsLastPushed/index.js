import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import StatsBinBar from '../../../../../components/Charts/Highcharts/StatsBinBarRepositories.js';
import {connect} from "react-redux";

class BinsLastPushed extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { statsPushedSince } = this.props;
        return (
            <CustomCard
                headerTitle="Time since last push"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Amount of time since repository was last pushed to."
            >
                {statsPushedSince.length > 0 ? (
                    <StatsBinBar
                        dataset={statsPushedSince}
                    />
                ): (
                    <span>No data available</span>
                )}
            </CustomCard>
        );
    }
}

BinsLastPushed.propTypes = {
    statsPushedSince: PropTypes.array.isRequired,
};

const mapState = state => ({
    statsPushedSince: state.repositoriesView.statsPushedSince,
});

export default connect(mapState, null)(BinsLastPushed);
