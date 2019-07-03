import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

class ConfirmPush extends Component {
  constructor(props) {
    super(props);
  }

  handleCreate = () => {
    const { setCreateFlag, updateCardsCreated, setOnSuccess } = this.props;
    setOnSuccess(updateCardsCreated);
    setCreateFlag(true);
  };

  handleClose = () => {
    const { setCreateConfirmModal } = this.props;
    setCreateConfirmModal(false);
  };

  render() {
    const {
      createConfirmModal,
      copyProjectDestination,
      createCardsCount
    } = this.props;
    return (
      <Dialog
        open={createConfirmModal}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to create {createCardsCount} cards in the project
            board {copyProjectDestination.name}.
            <br />
            Once processing is complete, you can simply delete the source
            project in GitHub.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            No
          </Button>
          <Button onClick={this.handleCreate} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ConfirmPush.propTypes = {
  classes: PropTypes.object.isRequired,
  createConfirmModal: PropTypes.bool.isRequired,
  setCreateConfirmModal: PropTypes.func.isRequired,
  copyProjectDestination: PropTypes.object.isRequired,
  createCardsCount: PropTypes.number.isRequired,
  setCreateFlag: PropTypes.func.isRequired,
  updateCardsCreated: PropTypes.func.isRequired,
  setOnSuccess: PropTypes.func.isRequired
};

const mapState = state => ({
  createConfirmModal: state.cardsCreate.createConfirmModal,
  copyProjectDestination: state.cardsCreate.copyProjectDestination,
  createCardsCount: state.cardsCreate.createCardsCount
});

const mapDispatch = dispatch => ({
  setCreateConfirmModal: dispatch.cardsCreate.setCreateConfirmModal,
  setCreateFlag: dispatch.cardsCreate.setCreateFlag,
  updateCardsCreated: dispatch.cardsCreate.updateCardsCreated,
  setOnSuccess: dispatch.loading.setOnSuccess
});

export default connect(
  mapState,
  mapDispatch
)(withStyles(styles)(ConfirmPush));
