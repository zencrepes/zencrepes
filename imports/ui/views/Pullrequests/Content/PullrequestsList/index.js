import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import PullrequestsTable from '../../../../components/PullrequestsTable/index.js';

class PullrequestsList extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { filteredPullrequests, pagination } = this.props;
        let dispPagination = pagination;
        if (pagination === undefined) {
            dispPagination = true;
        }
        return (
            <PullrequestsTable
                pagination={dispPagination}
                filteredPullrequests={filteredPullrequests}
            />
        );
    }
}

PullrequestsList.propTypes = {
    filteredPullrequests: PropTypes.array.isRequired,
    pagination: PropTypes.bool,
};

const mapState = state => ({
    filteredPullrequests: state.pullrequestsView.filteredPullrequests,
});

export default connect(mapState, null)(PullrequestsList);
