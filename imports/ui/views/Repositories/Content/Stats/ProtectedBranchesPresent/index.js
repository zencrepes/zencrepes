import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CustomCard from '../../../../../components/CustomCard/index.js';
import RepositoriesPie from '../../../../../components/Charts/ChartJS/RepositoriesPie.js';

import { connect } from 'react-redux';

class ProtectedBranchesPresent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { statsBranchProtectionPresent } = this.props;
    return (
      <CustomCard
        headerTitle='Has Protected Branches'
        headerFactTitle=''
        headerFactValue=''
        headerLegend='Display the number of repos which do have protected branches'
      >
        {statsBranchProtectionPresent.length > 0 ? (
          <RepositoriesPie dataset={statsBranchProtectionPresent} />
        ) : (
          <span>No data available</span>
        )}
      </CustomCard>
    );
  }
}

ProtectedBranchesPresent.propTypes = {
  statsBranchProtectionPresent: PropTypes.array.isRequired
};

const mapState = state => ({
  statsBranchProtectionPresent:
    state.repositoriesView.statsBranchProtectionPresent
});

export default connect(
  mapState,
  null
)(ProtectedBranchesPresent);
