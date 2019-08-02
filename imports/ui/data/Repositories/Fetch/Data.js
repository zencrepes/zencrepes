import { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withApollo } from "react-apollo";
import { withSnackbar } from "notistack";

import GET_GITHUB_REPOSITORIES from "../../../../graphql/getReposById.graphql";

import { cfgSources } from "../../Minimongo.js";
import { cfgRepositories } from "../../Minimongo.js";

import { reactLocalStorage } from "reactjs-localstorage";

class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.errorRetry = 0;
    this.repositoriesCount = 0;
  }

  componentDidUpdate = prevProps => {
    const { setLoadFlag, loadFlag, loading } = this.props;
    // Only trigger load if loadFlag transitioned from false to true
    if (
      loadFlag === true &&
      prevProps.loadFlag === false &&
      loading === false
    ) {
      setLoadFlag(false);
      this.load();
    }
  };

  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  chunk = (array, size) => {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
      chunked_arr.push(array.slice(index, size + index));
      index += size;
    }
    return chunked_arr;
  };

  load = async () => {
    const {
      setLoading,
      setLoadingMsg,
      setLoadingMsgAlt,
      setLoadingIterateTotal,
      incLoadingIterateCurrent,
      setLoadingIterateCurrent,
      setLoadingSuccessMsg,
      setLoadingSuccess,
      loadRepos,
      log,
      client,
      onSuccess,
      enqueueSnackbar
    } = this.props;

    this.repositoriesCount = 0;

    //Check if there if we are loading everything or just data for a subset of repositories
    let reposQuery = {};
    if (loadRepos.length > 0) {
      reposQuery = { id: { $in: loadRepos } };
    }

    let scanRepos = cfgSources.find(reposQuery).fetch();
    scanRepos = scanRepos.filter(repo => repo.active === true);

    setLoading(true);
    setLoadingIterateTotal(scanRepos.length);
    setLoadingIterateCurrent(0);
    await this.sleep(100); // This 100ms sleep allow for change of state for this.props.loading

    // Remove all repos that are not active
    let disabledRepos = cfgSources
      .find({ active: { $ne: true } })
      .fetch()
      .map(repo => repo.id);
    await cfgRepositories.remove({ id: { $in: disabledRepos } });

    // Slice the array of repositories by load increment
    const issuesBucketSize = parseInt(
      reactLocalStorage.get("dataFetchNodes", 30)
    );
    setLoadingMsgAlt(
      "Splitting repositories in buckets of " + issuesBucketSize
    );
    const chunkedArray = this.chunk(scanRepos, issuesBucketSize);

    // Loop through the array of arrays.
    let batchNb = 1;
    //await chunkedArray.forEach((arrayChunk) => {
    for (const arrayChunk of chunkedArray) {
      if (this.props.loading) {
        if (this.errorRetry <= 3) {
          let failureCount = 0;
          let baseMsg =
            arrayChunk.length * batchNb +
            "/" +
            scanRepos.length +
            " - Fetching a new batch of repositories";
          setLoadingMsg(baseMsg);
          setLoadingMsgAlt("Starting to load repositories");
          log.info(baseMsg);
          let data = {};

          const t0 = performance.now();
          // Loop for retry in case of failure.
          for (let i = 0; i < 4; i++) {
            if (data.data === undefined) {
              if (i > 0) {
                failureCount++;
                log.info("Failed loading data - retry #" + failureCount);
              }
              try {
                data = await client.query({
                  query: GET_GITHUB_REPOSITORIES,
                  variables: {
                    repository_array: arrayChunk.map(repo => repo.id)
                  },
                  fetchPolicy: "no-cache",
                  errorPolicy: "ignore"
                });
              } catch (error) {
                log.warn(error);
              }
            } else {
              failureCount = 0;
            }
          }
          log.info(data);

          if (
            data.data !== undefined &&
            data.data.errors !== undefined &&
            data.data.errors.length > 0
          ) {
            data.data.errors.forEach(error => {
              const nodeError = error.path[1];
              let repoPrefix = "";
              if (
                data.data.nodes !== undefined &&
                data.data.nodes[nodeError] !== undefined
              ) {
                repoPrefix =
                  data.data.nodes[nodeError].owner.login +
                  "/" +
                  data.data.nodes[nodeError].name +
                  ": ";
              }
              enqueueSnackbar(repoPrefix + error.message, {
                variant: "warning",
                persist: false
              });
            });
          }

          if (data.data !== undefined) {
            this.props.updateChip(data.data.rateLimit);

            if (data.data.nodes !== undefined) {
              const t1 = performance.now();
              const callDuration = t1 - t0;
              const apiPerf = Math.round(
                data.data.nodes.length / (callDuration / 1000)
              );
              setLoadingMsgAlt(
                "Fetching repositories at a rate of " + apiPerf + " repos/s"
              );

              for (const repo of data.data.nodes) {
                let repoObj = cfgSources.findOne({ id: repo.id });
                if (repoObj === undefined) {
                  // This repository doesn't exist anymore or was disabled.
                  // Removing it from local database
                  await cfgRepositories.remove({ id: repo.id });
                } else {
                  repoObj = { ...repoObj, ...repo };
                  await cfgRepositories.remove({ id: repoObj.id });
                  await cfgRepositories.upsert(
                    {
                      id: repoObj.id
                    },
                    {
                      $set: repoObj
                    }
                  );
                }
              }
              this.repositoriesCount =
                this.repositoriesCount + data.data.nodes.length;
              incLoadingIterateCurrent(data.data.nodes.length);
            }
          }
          batchNb++;
        } else {
          log.info("Got too many load errors, stopping");
          setLoading(false);
        }
      }
    }
    setLoading(false);
    setLoadingSuccess(true);
    setLoadingSuccessMsg("Loaded " + this.repositoriesCount + " repositories");
    onSuccess();
  };

  render() {
    return null;
  }
}

Data.propTypes = {
  loadFlag: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  loadRepos: PropTypes.array,

  setLoadFlag: PropTypes.func.isRequired,

  log: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,

  setLoading: PropTypes.func.isRequired,
  setLoadingMsg: PropTypes.func.isRequired,
  setLoadingMsgAlt: PropTypes.func.isRequired,
  setLoadingModal: PropTypes.func.isRequired,
  setLoadingIterateCurrent: PropTypes.func.isRequired,
  incLoadingIterateCurrent: PropTypes.func.isRequired,
  setLoadingIterateTotal: PropTypes.func.isRequired,
  setLoadingSuccess: PropTypes.func.isRequired,
  setLoadingSuccessMsg: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,

  updateChip: PropTypes.func.isRequired
};

const mapState = state => ({
  loadFlag: state.repositoriesFetch.loadFlag,
  loadRepos: state.repositoriesFetch.loadRepos,

  log: state.global.log,

  loading: state.loading.loading,
  onSuccess: state.loading.onSuccess
});

const mapDispatch = dispatch => ({
  setLoadFlag: dispatch.repositoriesFetch.setLoadFlag,

  setLoading: dispatch.loading.setLoading,
  setLoadingMsg: dispatch.loading.setLoadingMsg,
  setLoadingMsgAlt: dispatch.loading.setLoadingMsgAlt,
  setLoadingModal: dispatch.loading.setLoadingModal,
  setLoadingIterateCurrent: dispatch.loading.setLoadingIterateCurrent,
  incLoadingIterateCurrent: dispatch.loading.incLoadingIterateCurrent,
  setLoadingIterateTotal: dispatch.loading.setLoadingIterateTotal,
  setLoadingSuccess: dispatch.loading.setLoadingSuccess,
  setLoadingSuccessMsg: dispatch.loading.setLoadingSuccessMsg,

  updateChip: dispatch.chip.updateChip
});

export default connect(
  mapState,
  mapDispatch
)(withApollo(withSnackbar(Data)));
