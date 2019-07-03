import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import SelectProjectDropdown from "../../../../components/Projects/SelectProjectDropdown";
import ColumnsTable from "../../../../components/Projects/ColumnsTable";

class Source extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { projects, copyProjectSource, updateCopyProjectSource } = this.props;
    return (
      <React.Fragment>
        <SelectProjectDropdown
          type="source"
          projects={projects}
          selectedProject={copyProjectSource}
          updateSelectedProject={updateCopyProjectSource}
        />
        <ColumnsTable project={copyProjectSource} />
      </React.Fragment>
    );
  }
}

Source.propTypes = {
  projects: PropTypes.array.isRequired,
  copyProjectSource: PropTypes.object.isRequired,
  updateCopyProjectSource: PropTypes.func.isRequired
};

const mapState = state => ({
  projects: state.cardsCreate.projects,
  copyProjectSource: state.cardsCreate.copyProjectSource
});

const mapDispatch = dispatch => ({
  updateCopyProjectSource: dispatch.cardsCreate.updateCopyProjectSource
});

export default connect(
  mapState,
  mapDispatch
)(Source);
