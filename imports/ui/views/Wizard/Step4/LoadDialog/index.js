import React, { Component } from "react";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import OkButton from "./OkButton.js";

class LoadDialog extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Dialog aria-labelledby="simple-dialog-title" open={true}>
        <DialogTitle id="simple-dialog-title">
          No Repository selected
        </DialogTitle>
        <DialogContent>Please select at least one repository!</DialogContent>
        <DialogActions>
          <OkButton />
        </DialogActions>
      </Dialog>
    );
  }
}

export default LoadDialog;
