import React, { Component } from "react";
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import RepositoriesPie from "../../../../../components/Charts/ChartJS/RepositoriesPie.js";

import { connect } from "react-redux";

class TeamsPresent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { statsTeamsPresent } = this.props;
    return (
      <CustomCard
        headerTitle="With Teams"
        headerFactTitle=""
        headerFactValue=""
        headerLegend="Display the number of repos which do have Teams. Please fetch teams using the tools menu."
      >
        {statsTeamsPresent.length > 0 ? (
          <RepositoriesPie dataset={statsTeamsPresent} />
        ) : (
          <span>No data available</span>
        )}
      </CustomCard>
    );
  }
}

TeamsPresent.propTypes = {
  statsTeamsPresent: PropTypes.array.isRequired
};

const mapState = state => ({
  statsTeamsPresent: state.repositoriesView.statsTeamsPresent
});

export default connect(
  mapState,
  null
)(TeamsPresent);
