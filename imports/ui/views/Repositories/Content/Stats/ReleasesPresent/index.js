import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import RepositoriesPie from '../../../../../components/Charts/ChartJS/RepositoriesPie.js';

import {connect} from "react-redux";

class ReleasesPresent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { statsReleasesPresent } = this.props;
        return (
            <CustomCard
                headerTitle="With Releases"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Display the number of repos which do have releases"
            >
                {statsReleasesPresent.length > 0 ? (
                    <RepositoriesPie
                        dataset={statsReleasesPresent}
                    />
                ): (
                    <span>No data available</span>
                )}

            </CustomCard>
        );
    }
}

ReleasesPresent.propTypes = {
    statsReleasesPresent: PropTypes.array.isRequired,
};

const mapState = state => ({
    statsReleasesPresent: state.repositoriesView.statsReleasesPresent,
});

export default connect(mapState, null)(ReleasesPresent);