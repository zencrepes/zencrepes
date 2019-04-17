import React, { Component } from 'react';
import { connect } from "react-redux";

import PropTypes from "prop-types";

import CustomCard from "../../../components/CustomCard/index.js";

import MilestonesTable from './MilestonesTable.js';

class Milestones extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { milestones } = this.props;
        return (
            <CustomCard
                headerTitle="Milestones"
                headerFactTitle="Count"
                headerFactValue={milestones.length}
            >
                <MilestonesTable milestones={milestones} />
            </CustomCard>
        );
    }
}

Milestones.propTypes = {
    milestones: PropTypes.array.isRequired,
};

const mapState = state => ({
    milestones: state.projectView.milestones,
});

export default connect(mapState, null)(Milestones);
