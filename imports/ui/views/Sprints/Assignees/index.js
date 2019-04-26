import React, { Component } from 'react';
import { connect } from "react-redux";

import PropTypes from "prop-types";

import CustomCard from "../../../components/CustomCard/index.js";

import AssigneesTable from './AssigneesTable.js';
import AddButton from './AddButton.js';

import AddAssignee from './AddAssignee/index.js';

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
                <a className="anchor-link" id="assignees-table"></a>
                <AddAssignee />
                <AssigneesTable assignees={assignees} />
                <AddButton />
            </CustomCard>
        );
    }
}

Assignees.propTypes = {
    assignees: PropTypes.array.isRequired,
};

const mapState = state => ({
    assignees: state.sprintsView.assignees,
});

export default connect(mapState, null)(Assignees);
