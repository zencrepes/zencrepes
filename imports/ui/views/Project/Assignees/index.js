import React, { Component } from 'react';
import { connect } from "react-redux";

import PropTypes from "prop-types";

import CustomCard from "../../../components/CustomCard/index.js";

import AssigneesTable from './AssigneesTable.js';

class Assignees extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { assignees } = this.props;
        return (
            <CustomCard
                headerTitle="Assignees"
                headerFactTitle="Count"
                headerFactValue={assignees.length}
            >
                <AssigneesTable assignees={assignees} />
            </CustomCard>
        );
    }
}

Assignees.propTypes = {
    assignees: PropTypes.array.isRequired,
};

const mapState = state => ({
    assignees: state.projectView.assignees,
});

export default connect(mapState, null)(Assignees);
