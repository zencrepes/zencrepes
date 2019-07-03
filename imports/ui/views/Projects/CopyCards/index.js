import React, { Component } from "react";
import { withSnackbar } from "notistack";

import PropTypes from "prop-types";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import { connect } from "react-redux";

import Destination from "./Destination/index.js";
import Source from "./Source/index.js";
import CopyButton from "./CopyButton";

import CardsFetch from "../../../data/Cards/Fetch";
import CardsCreate from "../../../data/Cards/Create";
import ConfirmPush from "./ConfirmPush";

class CopyCards extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { initView } = this.props;
    initView();
  }

  close = () => {
    const { setShowCopyCards } = this.props;
    setShowCopyCards(false);
  };

  render() {
    const { showCopyCards } = this.props;
    if (showCopyCards) {
      return (
        <Dialog
          aria-labelledby="simple-dialog-title"
          open={showCopyCards}
          maxWidth="md"
        >
          <DialogTitle id="simple-dialog-title">
            Copy cards between projects
          </DialogTitle>
          <DialogContent>
            <CardsFetch />
            <CardsCreate />
            <ConfirmPush />
            <span>
              Copies a set of cards from an existing project to another project
              within the same organization.
              <br />
              Both projects must have the same configuration, you can use Github{" "}
              <a
                href="https://help.github.com/en/articles/copying-a-project-board"
                rel="noopener noreferrer"
                target="_blank"
              >
                project copy
              </a>{" "}
              feature.
            </span>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              spacing={8}
            >
              <Grid item xs={12} sm={6} md={6}>
                <Source />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Destination />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary" autoFocus>
              Close
            </Button>
            <CopyButton />
          </DialogActions>
        </Dialog>
      );
    } else {
      return null;
    }
  }
}

CopyCards.propTypes = {
  showCopyCards: PropTypes.bool.isRequired,
  setShowCopyCards: PropTypes.func.isRequired,
  initView: PropTypes.func.isRequired
};

const mapState = state => ({
  showCopyCards: state.cardsCreate.showCopyCards,
  projects: state.cardsCreate.projects
});

const mapDispatch = dispatch => ({
  setShowCopyCards: dispatch.cardsCreate.setShowCopyCards,
  initView: dispatch.cardsCreate.initView
});

export default connect(
  mapState,
  mapDispatch
)(withSnackbar(CopyCards));
