import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import PieChart from '../../../../../components/Charts/PieChart.js';

class PointsPopulated extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { stats } = this.props;
        return (
            <CustomCard
                headerTitle="Points / LOE"
                headerFactTitle=""
                headerFactValue=""
            >
                <PieChart
                    dataset={stats}
                />
            </CustomCard>
        );
    }
}

PointsPopulated.propTypes = {
    stats: PropTypes.array.isRequired,
};

export default PointsPopulated;
