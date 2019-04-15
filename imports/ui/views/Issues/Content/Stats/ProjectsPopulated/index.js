import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import PieChart from '../../../../../components/Charts/PieChart.js';

class ProjectsPopulated extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { stats } = this.props;
        return (
            <CustomCard
                headerTitle="Projects field"
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

ProjectsPopulated.propTypes = {
    stats: PropTypes.array.isRequired,
};

export default ProjectsPopulated;
