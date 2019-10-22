import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CustomCard from '../../../../../components/CustomCard/index.js';
import RepositoriesPie from '../../../../../components/Charts/ChartJS/RepositoriesPie.js';

import { connect } from 'react-redux';

class PullRequestsPresent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { statsPullRequestsPresent } = this.props;
    return (
      <CustomCard
        headerTitle='Has PRs'
        headerFactTitle=''
        headerFactValue=''
        headerLegend='Display the number of repos which do have PRs'
      >
        {statsPullRequestsPresent.length > 0 ? (
          <RepositoriesPie dataset={statsPullRequestsPresent} />
        ) : (
          <span>No data available</span>
        )}
      </CustomCard>
    );
  }
}

PullRequestsPresent.propTypes = {
  statsPullRequestsPresent: PropTypes.array.isRequired
};

const mapState = state => ({
  statsPullRequestsPresent: state.repositoriesView.statsPullRequestsPresent
});

export default connect(
  mapState,
  null
)(PullRequestsPresent);
