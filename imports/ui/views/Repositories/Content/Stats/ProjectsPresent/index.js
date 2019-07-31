import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import RepositoriesPie from '../../../../../components/Charts/ChartJS/RepositoriesPie.js';

import {connect} from "react-redux";

class ProjectsPresent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { statsProjectsPresent } = this.props;
        return (
            <CustomCard
                headerTitle="With Projects"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Display the number of repos which do have issues"
            >
                {statsProjectsPresent.length > 0 ? (
                    <RepositoriesPie
                        dataset={statsProjectsPresent}
                    />
                ): (
                    <span>No data available</span>
                )}

            </CustomCard>
        );
    }
}

ProjectsPresent.propTypes = {
    statsProjectsPresent: PropTypes.array.isRequired,
};

const mapState = state => ({
    statsProjectsPresent: state.repositoriesView.statsProjectsPresent,
});

export default connect(mapState, null)(ProjectsPresent);