import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";

import General from "../../layouts/General/index.js";

import RepositoriesFetch from "../../data/Repositories/Fetch/index.js";
import TeamsFetch from "../../data/Teams/Fetch/index.js";

import Actions from "./Actions/index.js";
import RepositoriesFacets from "./Facets/index.js";
import RepositoriesQuery from "./Query/index.js";
import RepositoriesTabs from "./Tabs/index.js";
import RepositoriesContent from "./Content/index.js";

import NoData from "./NoData/index.js";

import QueryUpdate from "../../components/Links/QueryUpdate/index.js";

const style = {
  root: {
    marginRight: "10px"
  },
  fullWidth: {
    width: "100%"
  }
};

class Repositories extends Component {
  constructor(props) {
    super(props);
  }

  //https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
  componentDidMount() {
    const { updateQuery, updateSelectedTab, match } = this.props;
    const params = new URLSearchParams(this.props.location.search);
    if (params.get("q") !== null) {
      const queryUrl = decodeURIComponent(params.get("q"));
      updateQuery(JSON.parse(queryUrl));
    } else {
      updateQuery({});
    }
    if (match.params.tab !== undefined) {
      updateSelectedTab(match.params.tab);
    }
  }

  componentDidUpdate(prevProps) {
    const { updateQuery, updateSelectedTab, match } = this.props;
    const params = new URLSearchParams(this.props.location.search);
    const queryUrl = decodeURIComponent(params.get("q"));

    const oldParams = new URLSearchParams(prevProps.location.search);
    const oldQueryUrl = decodeURIComponent(oldParams.get("q"));

    if (queryUrl !== oldQueryUrl) {
      updateQuery(JSON.parse(queryUrl));
    }
    if (match.params.tab !== undefined) {
      updateSelectedTab(match.params.tab);
    }
  }

  // Receive request to change tab, update URL accordingly
  changeTab = newTab => {
    const params = new URLSearchParams(this.props.location.search);
    let queryUrl = "{}";
    if (decodeURIComponent(params.get("q")) !== null) {
      queryUrl = decodeURIComponent(params.get("q"));
    }
    this.props.history.push({
      pathname: "/repositories/" + newTab,
      search: "?q=" + encodeURIComponent(queryUrl),
      state: { detail: queryUrl }
    });
  };

  render() {
    const { classes, repositories } = this.props;
    return (
      <General>
        <QueryUpdate />
        <RepositoriesFetch />
        <TeamsFetch />
        {repositories.length === 0 ? (
          <NoData />
        ) : (
          <React.Fragment>
            <Actions />
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              spacing={8}
            >
              <Grid item>
                <RepositoriesFacets />
              </Grid>
              <Grid item xs={12} sm container>
                <Grid
                  container
                  direction="column"
                  justify="flex-start"
                  alignItems="flex-start"
                >
                  <Grid item xs={12} sm className={classes.fullWidth}>
                    <RepositoriesQuery />
                  </Grid>
                  <Grid item xs={12} sm className={classes.fullWidth}>
                    <RepositoriesTabs changeTab={this.changeTab} />
                  </Grid>
                  <Grid item xs={12} sm className={classes.fullWidth}>
                    <RepositoriesContent />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        )}
      </General>
    );
  }
}

Repositories.propTypes = {
  classes: PropTypes.object.isRequired,
  updateQuery: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  repositories: PropTypes.array.isRequired,
  updateSelectedTab: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapDispatch = dispatch => ({
  updateQuery: dispatch.repositoriesView.updateQuery,
  updateSelectedTab: dispatch.repositoriesView.updateSelectedTab
});

const mapState = state => ({
  repositories: state.repositoriesView.repositories
});

export default connect(
  mapState,
  mapDispatch
)(withRouter(withStyles(style)(Repositories)));
