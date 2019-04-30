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
        const { contributionsMilestones, defaultPoints } = this.props;

        return (
            <CustomCard
                headerTitle="Milestones"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Repartition of effort per milestone over the past 4 weeks"
            >
                {contributionsMilestones.length > 0 ? (
                    <IssuesTree
                        dataset={contributionsMilestones}
                        emptyName="Milestones"
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
    contributionsMilestones: PropTypes.array.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
};

const mapState = state => ({
    contributionsMilestones: state.issuesView.contributionsMilestones,
    defaultPoints: state.issuesView.defaultPoints,
});

export default connect(mapState, null)(Milestones);
