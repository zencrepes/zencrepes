import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import IssuesTable from "../../../components/IssuesTable/index.js";
import CustomCard from "../../../components/CustomCard/index.js";

import RefreshButton from './RefreshButton.js';

class Issues extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { issues } = this.props;

        return (
            <CustomCard
                headerTitle="Issues"
                headerIcon={<RefreshButton />}
                headerFactTitle="Issues in Sprint"
                headerFactValue={issues.length}
            >
                <IssuesTable
                    filteredIssues={issues}
                    pagination={false}
                />
            </CustomCard>
        );
    }
}

Issues.propTypes = {
    issues: PropTypes.array.isRequired,
};

const mapState = state => ({
    issues: state.projectView.issues,
});

export default connect(mapState, null)(Issues);

