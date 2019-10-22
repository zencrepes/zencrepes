import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CustomCard from '../../../../../components/CustomCard/index.js';
import RepositoriesPie from '../../../../../components/Charts/ChartJS/RepositoriesPie.js';

import { connect } from 'react-redux';

class HasCodeOfConduct extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { statsHasCodeOfConduct } = this.props;
    return (
      <CustomCard
        headerTitle='Has Code of Conduct'
        headerFactTitle=''
        headerFactValue=''
        headerLegend='Display repositories with a Code of Conduct defined'
      >
        {statsHasCodeOfConduct.length > 0 ? (
          <RepositoriesPie dataset={statsHasCodeOfConduct} />
        ) : (
          <span>No data available</span>
        )}
      </CustomCard>
    );
  }
}

HasCodeOfConduct.propTypes = {
  statsHasCodeOfConduct: PropTypes.array.isRequired
};

const mapState = state => ({
  statsHasCodeOfConduct: state.repositoriesView.statsHasCodeOfConduct
});

export default connect(
  mapState,
  null
)(HasCodeOfConduct);
