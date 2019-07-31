import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import RepositoriesPie from '../../../../../components/Charts/ChartJS/RepositoriesPie.js';

import {connect} from "react-redux";

class MilestonesPresent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { statsMilestonesPresent } = this.props;
        return (
            <CustomCard
                headerTitle="With Milestones"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Display the number of repos which do have milestones"
            >
                {statsMilestonesPresent.length > 0 ? (
                    <RepositoriesPie
                        dataset={statsMilestonesPresent}
                    />
                ): (
                    <span>No data available</span>
                )}

            </CustomCard>
        );
    }
}

MilestonesPresent.propTypes = {
    statsMilestonesPresent: PropTypes.array.isRequired,
};

const mapState = state => ({
    statsMilestonesPresent: state.repositoriesView.statsMilestonesPresent,
});

export default connect(mapState, null)(MilestonesPresent);