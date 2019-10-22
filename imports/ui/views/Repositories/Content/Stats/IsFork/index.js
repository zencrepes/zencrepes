import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CustomCard from '../../../../../components/CustomCard/index.js';
import RepositoriesPie from '../../../../../components/Charts/ChartJS/RepositoriesPie.js';

import { connect } from 'react-redux';

class IsFork extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { statsIsFork } = this.props;
    return (
      <CustomCard
        headerTitle='Repo is a Fork'
        headerFactTitle=''
        headerFactValue=''
        headerLegend='Display repositories based on a Fork'
      >
        {statsIsFork.length > 0 ? (
          <RepositoriesPie dataset={statsIsFork} />
        ) : (
          <span>No data available</span>
        )}
      </CustomCard>
    );
  }
}

IsFork.propTypes = {
  statsIsFork: PropTypes.array.isRequired
};

const mapState = state => ({
  statsIsFork: state.repositoriesView.statsIsFork
});

export default connect(
  mapState,
  null
)(IsFork);
