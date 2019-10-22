import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CustomCard from '../../../../../components/CustomCard/index.js';
import RepositoriesPie from '../../../../../components/Charts/ChartJS/RepositoriesPie.js';

import { connect } from 'react-redux';

class IssuesPresent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { statsIssuesPresent } = this.props;
    return (
      <CustomCard
        headerTitle='Has Issues'
        headerFactTitle=''
        headerFactValue=''
        headerLegend='Display the number of repos which do have issues'
      >
        {statsIssuesPresent.length > 0 ? (
          <RepositoriesPie dataset={statsIssuesPresent} />
        ) : (
          <span>No data available</span>
        )}
      </CustomCard>
    );
  }
}

IssuesPresent.propTypes = {
  statsIssuesPresent: PropTypes.array.isRequired
};

const mapState = state => ({
  statsIssuesPresent: state.repositoriesView.statsIssuesPresent
});

export default connect(
  mapState,
  null
)(IssuesPresent);
