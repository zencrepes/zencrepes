import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import StatsBinBar from '../../../../../components/Charts/StatsBinBar.js';
import {connect} from "react-redux";

class BinsOpenedDuring extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { statsOpenedDuring } = this.props;
        return (
            <CustomCard
                headerTitle="Were open during"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Issues with a CLOSED state, amount of time stayed open."
            >
                {statsOpenedDuring.length > 0 ? (
                    <StatsBinBar
                        dataset={statsOpenedDuring}
                    />
                ): (
                    <span>No data available</span>
                )}
            </CustomCard>
        );
    }
}

BinsOpenedDuring.propTypes = {
    statsOpenedDuring: PropTypes.array.isRequired,
};

const mapState = state => ({
    statsOpenedDuring: state.issuesView.statsOpenedDuring,
});

export default connect(mapState, null)(BinsOpenedDuring);
