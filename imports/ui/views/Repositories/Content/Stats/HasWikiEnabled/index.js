import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CustomCard from '../../../../../components/CustomCard/index.js';
import RepositoriesPie from '../../../../../components/Charts/ChartJS/RepositoriesPie.js';

import { connect } from 'react-redux';

class HasWikiEnabled extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { statsHasWikiEnabled } = this.props;
    return (
      <CustomCard
        headerTitle='Wiki Enabled'
        headerFactTitle=''
        headerFactValue=''
        headerLegend='Display repositories with Wiki enabled'
      >
        {statsHasWikiEnabled.length > 0 ? (
          <RepositoriesPie dataset={statsHasWikiEnabled} />
        ) : (
          <span>No data available</span>
        )}
      </CustomCard>
    );
  }
}

HasWikiEnabled.propTypes = {
  statsHasWikiEnabled: PropTypes.array.isRequired
};

const mapState = state => ({
  statsHasWikiEnabled: state.repositoriesView.statsHasWikiEnabled
});

export default connect(
  mapState,
  null
)(HasWikiEnabled);
