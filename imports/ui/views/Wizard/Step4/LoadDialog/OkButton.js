import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import { connect } from "react-redux";

class CancelButton extends Component {
  constructor(props) {
    super(props);
  }

  cancel = () => {
    const { changeActiveStep } = this.props;
    changeActiveStep(2);
  };

  render() {
    return <Button onClick={this.cancel}>OK</Button>;
  }
}

CancelButton.propTypes = {
  changeActiveStep: PropTypes.func.isRequired
};

const mapDispatch = dispatch => ({
  changeActiveStep: dispatch.wizardView.changeActiveStep
});

export default connect(
  null,
  mapDispatch
)(CancelButton);
