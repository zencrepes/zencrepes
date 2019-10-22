import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CustomCard from '../../../../../components/CustomCard/index.js';
import RepositoriesPie from '../../../../../components/Charts/ChartJS/RepositoriesPie.js';

import { connect } from 'react-redux';

class HasDescription extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { statsHasDescription } = this.props;
    return (
      <CustomCard
        headerTitle='Has Description'
        headerFactTitle=''
        headerFactValue=''
        headerLegend='Display repositories with a description populated'
      >
        {statsHasDescription.length > 0 ? (
          <RepositoriesPie dataset={statsHasDescription} />
        ) : (
          <span>No data available</span>
        )}
      </CustomCard>
    );
  }
}

HasDescription.propTypes = {
  statsHasDescription: PropTypes.array.isRequired
};

const mapState = state => ({
  statsHasDescription: state.repositoriesView.statsHasDescription
});

export default connect(
  mapState,
  null
)(HasDescription);
