import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CustomCard from '../../../../../components/CustomCard/index.js';
import StatsBinBar from '../../../../../components/Charts/Highcharts/StatsBinBarRepositories.js';
import { connect } from 'react-redux';

class BinsForkCount extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { statsForkCount } = this.props;
    return (
      <CustomCard
        headerTitle='Fork Count'
        headerFactTitle=''
        headerFactValue=''
        headerLegend='Number of Forks'
      >
        {statsForkCount.length > 0 ? (
          <StatsBinBar dataset={statsForkCount} />
        ) : (
          <span>No data available</span>
        )}
      </CustomCard>
    );
  }
}

BinsForkCount.propTypes = {
  statsForkCount: PropTypes.array.isRequired
};

const mapState = state => ({
  statsForkCount: state.repositoriesView.statsForkCount
});

export default connect(
  mapState,
  null
)(BinsForkCount);
