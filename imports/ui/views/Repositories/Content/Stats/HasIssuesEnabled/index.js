import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CustomCard from '../../../../../components/CustomCard/index.js';
import RepositoriesPie from '../../../../../components/Charts/ChartJS/RepositoriesPie.js';

import { connect } from 'react-redux';

class HasIssuesEnabled extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { statsHasIssuesEnabled } = this.props;
    return (
      <CustomCard
        headerTitle='Issues Enabled'
        headerFactTitle=''
        headerFactValue=''
        headerLegend='Display repositories with issues enabled'
      >
        {statsHasIssuesEnabled.length > 0 ? (
          <RepositoriesPie dataset={statsHasIssuesEnabled} />
        ) : (
          <span>No data available</span>
        )}
      </CustomCard>
    );
  }
}

HasIssuesEnabled.propTypes = {
  statsHasIssuesEnabled: PropTypes.array.isRequired
};

const mapState = state => ({
  statsHasIssuesEnabled: state.repositoriesView.statsHasIssuesEnabled
});

export default connect(
  mapState,
  null
)(HasIssuesEnabled);
