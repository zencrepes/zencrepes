import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Grid from "@material-ui/core/Grid";

class Actions extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppBar position="static" color="primary">
        <Toolbar>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            spacing={8}
          >
            <Grid item xs={12} sm container>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

Actions.propTypes = {
  defaultPoints: PropTypes.bool.isRequired,
  setDefaultPoints: PropTypes.func.isRequired
};

const mapState = state => ({
  defaultPoints: state.issuesView.defaultPoints
});

const mapDispatch = dispatch => ({
  setDefaultPoints: dispatch.issuesView.setDefaultPoints
});

export default connect(
  mapState,
  mapDispatch
)(Actions);
