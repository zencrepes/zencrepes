import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CustomCard from '../../../../../components/CustomCard/index.js';
import StatsBinBar from '../../../../../components/Charts/Highcharts/StatsBinBarRepositories.js';
import { connect } from 'react-redux';

class BinsStargazersCount extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { statsStargazersCount } = this.props;
    return (
      <CustomCard
        headerTitle='Stargazers Count'
        headerFactTitle=''
        headerFactValue=''
        headerLegend='Number of Stargazerss'
      >
        {statsStargazersCount.length > 0 ? (
          <StatsBinBar dataset={statsStargazersCount} />
        ) : (
          <span>No data available</span>
        )}
      </CustomCard>
    );
  }
}

BinsStargazersCount.propTypes = {
  statsStargazersCount: PropTypes.array.isRequired
};

const mapState = state => ({
  statsStargazersCount: state.repositoriesView.statsStargazersCount
});

export default connect(
  mapState,
  null
)(BinsStargazersCount);
