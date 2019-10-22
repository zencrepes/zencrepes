import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CustomCard from '../../../../../components/CustomCard/index.js';
import RepositoriesPie from '../../../../../components/Charts/ChartJS/RepositoriesPie.js';

import { connect } from 'react-redux';

class IsPrivate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { statsIsPrivate } = this.props;
    return (
      <CustomCard
        headerTitle='Is Private'
        headerFactTitle=''
        headerFactValue=''
        headerLegend='Display repositories based on a Private'
      >
        {statsIsPrivate.length > 0 ? (
          <RepositoriesPie dataset={statsIsPrivate} />
        ) : (
          <span>No data available</span>
        )}
      </CustomCard>
    );
  }
}

IsPrivate.propTypes = {
  statsIsPrivate: PropTypes.array.isRequired
};

const mapState = state => ({
  statsIsPrivate: state.repositoriesView.statsIsPrivate
});

export default connect(
  mapState,
  null
)(IsPrivate);
