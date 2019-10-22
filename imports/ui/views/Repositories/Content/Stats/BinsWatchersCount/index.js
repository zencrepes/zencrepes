import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CustomCard from '../../../../../components/CustomCard/index.js';
import StatsBinBar from '../../../../../components/Charts/Highcharts/StatsBinBarRepositories.js';
import { connect } from 'react-redux';

class BinsWatchersCount extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { statsWatchersCount } = this.props;
    return (
      <CustomCard
        headerTitle='Watchers Count'
        headerFactTitle=''
        headerFactValue=''
        headerLegend='Number of Watcherss'
      >
        {statsWatchersCount.length > 0 ? (
          <StatsBinBar dataset={statsWatchersCount} />
        ) : (
          <span>No data available</span>
        )}
      </CustomCard>
    );
  }
}

BinsWatchersCount.propTypes = {
  statsWatchersCount: PropTypes.array.isRequired
};

const mapState = state => ({
  statsWatchersCount: state.repositoriesView.statsWatchersCount
});

export default connect(
  mapState,
  null
)(BinsWatchersCount);
