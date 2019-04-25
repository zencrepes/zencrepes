import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import MsTreemap from './MsTreemap.js';
import {connect} from "react-redux";

class Projects extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { contributionsProjects, defaultPoints, setUpdateQueryPath, setUpdateQuery } = this.props;

        return (
            <CustomCard
                headerTitle="Projects"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Repartition of effort per project over the past 4 weeks"
            >
                {contributionsProjects.length > 0 ? (
                    <MsTreemap
                        dataset={contributionsProjects}
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

Projects.propTypes = {
    contributionsProjects: PropTypes.array.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
    setUpdateQueryPath: PropTypes.func.isRequired,
    setUpdateQuery: PropTypes.func.isRequired,
};

const mapState = state => ({
    contributionsProjects: state.issuesView.contributionsProjects,
    defaultPoints: state.issuesView.defaultPoints,
});

const mapDispatch = dispatch => ({
    setUpdateQueryPath: dispatch.global.setUpdateQueryPath,
    setUpdateQuery: dispatch.global.setUpdateQuery,
});

export default connect(mapState, mapDispatch)(Projects);
