import { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withApollo } from "react-apollo";

import GET_GITHUB_CARDS from "../../../../graphql/getCards.graphql";

import { cfgCards } from "../../Minimongo.js";

import calculateQueryIncrement from "../../utils/calculateQueryIncrement.js";

class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.errorRetry = 0;
    this.cardsCount = 0;
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

  load = async () => {
    const {
      setLoading,
      setLoadingMsgAlt,
      setLoadingIterateTotal,
      incLoadingIterateCurrent,
      setLoadingIterateCurrent,
      setLoadingSuccessMsg,
      setLoadingSuccess,
      loadColumns,
      log,
      onSuccess
    } = this.props;

    setLoading(true);
    setLoadingIterateTotal(loadColumns.length);
    setLoadingIterateCurrent(0);
    await this.sleep(100); // This 100ms sleep allow for change of state for this.props.loading

    //Fist action is to clear all cards from the minimongo instance
    cfgCards.remove({});

    for (let column of loadColumns) {
      log.info(
        "Processing column: " +
          column.name +
          " - should have " +
          column.cards.totalCount +
          " cards"
      );
      setLoadingMsgAlt("Fetching cards from column: " + column.name);

      // We always start by loading 5 cards in the repository
      // This is also used to refresh the total number of cards & labels in the repo, which might have
      // changed since last data load.
      // In the reload there is a need to take in consideration the sitatution where an card is created during load
      // and find how to prevent an infinite loop. Might be sufficient to based on the following query after last cursor
      // TODO - Need to refresh cards content as well, so need to bring last updated date in the logic
      await this.getCardsPagination(null, 5, column);
      incLoadingIterateCurrent(1);
      setLoadingSuccessMsg("Fetched " + this.cardsCount + " cards");
    }

    log.info(
      "Load completed: There is a total of " +
        cfgCards.find({}).count() +
        " cards in memory"
    );
    setLoadingSuccess(true);
    setLoading(false); // Set to true to indicate cards are done loading.
    this.cardsCount = 0;
    onSuccess();
  };

  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // TODO- There is a big card with the way the query increment is calculated, if remote has 100 cards, but local only has 99
  // Query increment should not be just 1 since if the missing card is far down, this will generate a large number of calls
  getCardsPagination = async (cursor, increment, column) => {
    const { client, setLoading, log } = this.props;
    if (this.props.loading) {
      if (this.errorRetry <= 3) {
        let data = {};
        const t0 = performance.now();
        try {
          await this.sleep(1000); // Wait 2s between requests to avoid hitting GitHub API rate limit => https://developer.github.com/v3/guides/best-practices-for-integrators/
          data = await client.query({
            query: GET_GITHUB_CARDS,
            variables: {
              cursor: cursor,
              increment: increment,
              column_id: column.id
            },
            fetchPolicy: "no-cache",
            errorPolicy: "ignore"
          });
          log.info(data);
        } catch (error) {
          log.info(error);
        }
        const t1 = performance.now();
        const callDuration = t1 - t0;
        log.info(column);
        if (data.data !== null && data.data !== undefined) {
          this.errorRetry = 0;
          this.props.updateChip(data.data.rateLimit);
          // Check if cards were returned
          if (
            data.data.node !== null &&
            data.data.node.cards.edges.length > 0
          ) {
            let lastCursor = await this.ingestCards(data, column, callDuration);
            let loadedcardsCount = cfgCards
              .find({ "column.id": column.id })
              .count();
            let queryIncrement = calculateQueryIncrement(
              loadedcardsCount,
              data.data.node.cards.totalCount
            );
            log.info(
              "Loading cards for column:  " +
                column.name +
                " - Query Increment: " +
                queryIncrement +
                " - Local Count: " +
                loadedcardsCount +
                " - Remote Count: " +
                data.data.node.cards.totalCount
            );
            if (queryIncrement > 0 && lastCursor !== null) {
              //Start recurring call, to load all cards from a column
              await this.getCardsPagination(lastCursor, queryIncrement, column);
            }
          }
        } else {
          this.errorRetry = this.errorRetry + 1;
          log.info("Error loading content, current count: " + this.errorRetry);
          await this.getCardsPagination(cursor, increment, column);
        }
      } else {
        log.info("Got too many load errors, stopping");
        setLoading(false);
      }
    }
  };

  ingestCards = async (data, column, callDuration) => {
    const { setLoadingMsg, setLoadingMsgAlt, log } = this.props;

    let lastCursor = null;
    let stopLoad = false;

    if (data.data.node.cards.edges.length > 0) {
      const apiPerf = Math.round(
        data.data.node.cards.edges.length / (callDuration / 1000)
      );
      setLoadingMsgAlt(
        "Fetching cards from column: " +
          column.name +
          ", rate: " +
          apiPerf +
          " cards/s"
      );
    }

    log.info(data);
    for (var currentCard of data.data.node.cards.edges) {
      log.info(currentCard);
      log.info("Loading card: " + currentCard.node.id);
      //increment is used for capture the order in which cards are received
      await cfgCards.upsert(
        {
          id: currentCard.node.id
        },
        {
          $set: { ...currentCard.node, increment: this.cardsCount }
        }
      );

      this.cardsCount = this.cardsCount + 1;
      setLoadingMsg(this.cardsCount + " cards loaded");
      lastCursor = currentCard.cursor;
    }

    if (lastCursor === null) {
      log.info(
        "=> No more updates to load, will not be making another GraphQL call for this repository"
      );
    }
    if (stopLoad === true) {
      lastCursor = null;
    }
    return lastCursor;
  };

  render() {
    return null;
  }
}

Data.propTypes = {
  loadFlag: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  loadColumns: PropTypes.array,

  setLoadFlag: PropTypes.func.isRequired,

  log: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,

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
  loadFlag: state.cardsFetch.loadFlag,
  loadColumns: state.cardsFetch.loadColumns,

  log: state.global.log,

  loading: state.loading.loading,
  onSuccess: state.loading.onSuccess
});

const mapDispatch = dispatch => ({
  setLoadFlag: dispatch.cardsFetch.setLoadFlag,

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
)(withApollo(Data));
