import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import IssuesTree from '../../../../../components/Charts/Nivo/IssuesTree.js';

import {connect} from "react-redux";

class Milestones extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { contributionsAreas, defaultPoints } = this.props;
        return (
            <CustomCard
                headerTitle="Areas"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Repartition of effort per area over the past 4 weeks"
            >
                {contributionsAreas.length > 0 ? (
                    <IssuesTree
                        dataset={contributionsAreas}
                        emptyName="Area"
                        defaultPoints={defaultPoints}
                    />
                ): (
                    <span>No data available</span>
                )}

            </CustomCard>
        );
    }
}

Milestones.propTypes = {
    contributionsAreas: PropTypes.array.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
};

const mapState = state => ({
    contributionsAreas: state.issuesView.contributionsAreas,
    defaultPoints: state.issuesView.defaultPoints,
});

export default connect(mapState, null)(Milestones);
