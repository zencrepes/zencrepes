import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import RepositoriesTable from '../../../../components/RepositoriesTable/index.js';

class RepositoriesList extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { filteredRepositories, pagination } = this.props;
        let dispPagination = pagination;
        if (pagination === undefined) {
            dispPagination = true;
        }
        return (
            <RepositoriesTable
                pagination={dispPagination}
                filteredRepositories={filteredRepositories}
            />
        );
    }
}

RepositoriesList.propTypes = {
    filteredRepositories: PropTypes.array.isRequired,
    pagination: PropTypes.bool,
};

const mapState = state => ({
    filteredRepositories: state.repositoriesView.filteredRepositories,
});

export default connect(mapState, null)(RepositoriesList);
