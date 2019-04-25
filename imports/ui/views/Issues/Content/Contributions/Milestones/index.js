import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import MsTreemap from './MsTreemap.js';
import {connect} from "react-redux";

class Milestones extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { contributionsMilestones, defaultPoints, setUpdateQueryPath, setUpdateQuery } = this.props;

        return (
            <CustomCard
                headerTitle="Milestones"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Repartition of effort per milestone over the past 4 weeks"
            >
                {contributionsMilestones.length > 0 ? (
                    <MsTreemap
                        dataset={contributionsMilestones}
                        setUpdateQueryPath={setUpdateQueryPath}
                        setUpdateQuery={setUpdateQuery}
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
    setUpdateQueryPath: PropTypes.func.isRequired,
    setUpdateQuery: PropTypes.func.isRequired,
};

const mapState = state => ({
    contributionsMilestones: state.issuesView.contributionsMilestones,
    defaultPoints: state.issuesView.defaultPoints,
});

const mapDispatch = dispatch => ({
    setUpdateQueryPath: dispatch.global.setUpdateQueryPath,
    setUpdateQuery: dispatch.global.setUpdateQuery,
});

export default connect(mapState, mapDispatch)(Milestones);
