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
        const { contributionsAreas, defaultPoints, setUpdateQueryPath, setUpdateQuery } = this.props;

        return (
            <CustomCard
                headerTitle="Areas"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Repartition of effort per area over the past 4 weeks"
            >
                {contributionsAreas.length > 0 ? (
                    <MsTreemap
                        dataset={contributionsAreas}
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
    contributionsAreas: PropTypes.array.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
    setUpdateQueryPath: PropTypes.func.isRequired,
    setUpdateQuery: PropTypes.func.isRequired,
};

const mapState = state => ({
    contributionsAreas: state.issuesView.contributionsAreas,
    defaultPoints: state.issuesView.defaultPoints,
});

const mapDispatch = dispatch => ({
    setUpdateQueryPath: dispatch.global.setUpdateQueryPath,
    setUpdateQuery: dispatch.global.setUpdateQuery,
});

export default connect(mapState, mapDispatch)(Milestones);
