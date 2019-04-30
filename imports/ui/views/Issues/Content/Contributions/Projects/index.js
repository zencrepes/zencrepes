import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import IssuesTree from '../../../../../components/Charts/Nivo/IssuesTree.js';
import {connect} from "react-redux";

class Projects extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { contributionsProjects, defaultPoints } = this.props;
        return (
            <CustomCard
                headerTitle="Projects"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Repartition of effort per project over the past 4 weeks"
            >
                {contributionsProjects.length > 0 ? (
                    <IssuesTree
                        dataset={contributionsProjects}
                        defaultPoints={defaultPoints}
                        emptyName="Projects"
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
};

const mapState = state => ({
    contributionsProjects: state.issuesView.contributionsProjects,
    defaultPoints: state.issuesView.defaultPoints,
});

export default connect(mapState, null)(Projects);
