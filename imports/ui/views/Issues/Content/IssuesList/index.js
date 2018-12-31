import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import IssuesTable from '../../../../components/IssuesTable/index.js';

class IssuesList extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { filteredIssues, pagination } = this.props;
        let dispPagination = pagination;
        if (pagination === undefined) {
            dispPagination = true;
        }
        return (
            <IssuesTable
                pagination={dispPagination}
                filteredIssues={filteredIssues}
            />
        );
    }
}

IssuesList.propTypes = {
    filteredIssues: PropTypes.array.isRequired,
    pagination: PropTypes.bool,
};

const mapState = state => ({
    filteredIssues: state.issuesView.filteredIssues,
});

export default connect(mapState, null)(IssuesList);
