import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";

import RepositoriesTable from "../../../../components/RepositoriesTable/index.js";

class RepositoriesList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { repositories, pagination } = this.props;
    let dispPagination = pagination;
    if (pagination === undefined) {
      dispPagination = true;
    }
    return (
      <RepositoriesTable
        pagination={dispPagination}
        repositories={repositories}
      />
    );
  }
}

RepositoriesList.propTypes = {
  repositories: PropTypes.array.isRequired,
  pagination: PropTypes.bool
};

const mapState = state => ({
  repositories: state.repositoriesView.repositories
});

export default connect(
  mapState,
  null
)(RepositoriesList);
