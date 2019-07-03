import React, { Component } from "react";

import PropTypes from "prop-types";

import { connect } from "react-redux";

import SelectProjectDropdown from "../../../../components/Projects/SelectProjectDropdown";
import ColumnsTable from "../../../../components/Projects/ColumnsTable";

class Destination extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      projects,
      copyProjectDestination,
      updateCopyProjectDestination
    } = this.props;
    return (
      <React.Fragment>
        <SelectProjectDropdown
          type="destination"
          projects={projects}
          selectedProject={copyProjectDestination}
          updateSelectedProject={updateCopyProjectDestination}
        />
        <ColumnsTable project={copyProjectDestination} />
      </React.Fragment>
    );
  }
}

Destination.propTypes = {
  projects: PropTypes.array.isRequired,
  copyProjectDestination: PropTypes.object.isRequired,
  updateCopyProjectDestination: PropTypes.func.isRequired
};

const mapState = state => ({
  projects: state.cardsCreate.projects,
  copyProjectDestination: state.cardsCreate.copyProjectDestination
});

const mapDispatch = dispatch => ({
  updateCopyProjectDestination:
    dispatch.cardsCreate.updateCopyProjectDestination
});

export default connect(
  mapState,
  mapDispatch
)(Destination);
