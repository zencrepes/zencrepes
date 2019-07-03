import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";

import { connect } from "react-redux";

class CopyButton extends Component {
  constructor(props) {
    super(props);
  }

  loadCards = () => {
    // Build an array of columns
    const {
      copyProjectSource,
      setLoadColumns,
      setLoadFlag,
      preparePushCards,
      setOnSuccess
    } = this.props;
    setOnSuccess(preparePushCards);
    setLoadColumns(copyProjectSource.columns.edges.map(column => column.node));
    setLoadFlag(true);
  };

  render() {
    const { copyProjectDestination, copyProjectSource } = this.props;
    return (
      <Button
        onClick={this.loadCards}
        color="primary"
        disabled={
          copyProjectDestination.id === "none" ||
          copyProjectSource.id === "none"
        }
      >
        Copy Cards
      </Button>
    );
  }
}

CopyButton.propTypes = {
  copyProjectDestination: PropTypes.object.isRequired,
  copyProjectSource: PropTypes.object.isRequired,
  setLoadFlag: PropTypes.func.isRequired,
  setLoadColumns: PropTypes.func.isRequired,
  setOnSuccess: PropTypes.func.isRequired,
  preparePushCards: PropTypes.func.isRequired
};

const mapState = state => ({
  copyProjectDestination: state.cardsCreate.copyProjectDestination,
  copyProjectSource: state.cardsCreate.copyProjectSource
});

const mapDispatch = dispatch => ({
  preparePushCards: dispatch.cardsCreate.preparePushCards,
  setLoadFlag: dispatch.cardsFetch.setLoadFlag,
  setLoadColumns: dispatch.cardsFetch.setLoadColumns,
  setOnSuccess: dispatch.loading.setOnSuccess
});

export default connect(
  mapState,
  mapDispatch
)(CopyButton);
