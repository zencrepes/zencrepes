import { Meteor } from "meteor/meteor";
import { Component } from "react";

import { connect } from "react-redux";
import { withApollo } from "react-apollo";

import { cfgCards } from "../../Minimongo";

import GitHubApi from "@octokit/rest";
import PropTypes from "prop-types";

class Data extends Component {
  constructor(props) {
    super(props);
    this.repositories = [];

    this.octokit = new GitHubApi();
    this.octokit.authenticate({
      type: "oauth",
      token: Meteor.user().services.github.accessToken
    });
  }

  shouldComponentUpdate(nextProps) {
    const { createFlag } = this.props;
    if (createFlag !== nextProps.createFlag) {
      return true;
    } else {
      return false;
    }
  }

  componentDidUpdate() {
    const { setCreateFlag, createFlag, loading } = this.props;
    if (createFlag && loading === false) {
      setCreateFlag(false); // Right away set loadRepositories to false
      this.load(); // Logic to load Cards
    }
  }

  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  load = async () => {
    const {
      setChipRemaining,
      setLoading,
      setLoadingSuccess,
      setLoadingSuccessMsg,
      setLoadingModal,
      setLoadingMsg,
      setLoadingMsgAlt,
      log,
      onSuccess
    } = this.props;
    setLoadingModal(true);
    setLoadingMsgAlt("");
    setLoading(true); // Set loading to true to indicate content is actually loading.
    setLoadingSuccess(false);

    //Increment is used for creating cards in the same order
    for (let card of cfgCards
      .find({}, { sort: { increment: -1 }, reactive: false, transform: null })
      .fetch()) {
      log.info(card);
      let result = false;
      if (card.content === null) {
        setLoadingMsg("Creating note card");
      } else {
        setLoadingMsg(
          "Creating card attached to " +
            card.content.__typename +
            " " +
            card.content.title +
            " (#" +
            card.content.number +
            ")"
        );
      }
      let createPayload = {
        column_id: card.destinationColumn.databaseId,
        headers: {
          accept: "application/vnd.github.inertia-preview+json"
        }
      };
      if (card.note !== null) {
        createPayload = {
          ...createPayload,
          note: card.note
        };
      }
      if (card.content !== null) {
        createPayload = {
          ...createPayload,
          content_type: card.content.__typename,
          content_id: card.content.databaseId
        };
      }
      log.info(createPayload);

      try {
        result = await this.octokit.projects.createCard(createPayload);
      } catch (error) {
        log.info(error);
        setLoadingMsg("Error while creating card, does it already exist?");
        await this.sleep(500);
      }

      if (card.isArchived === true) {
        // Automatically archive the card
        const cardId = result.data.id;
        try {
          result = await this.octokit.projects.updateCard({
            card_id: cardId,
            archived: true
          });
        } catch (error) {
          log.info(error);
          setLoadingMsg("Error while archiving the card");
          await this.sleep(500);
        }
      }

      if (result !== false) {
        setChipRemaining(parseInt(result.headers["x-ratelimit-remaining"]));
      }
    }

    // Refresh project

    setLoadingSuccessMsg("Update Completed");
    setLoadingSuccess(true);
    setLoading(false);
    onSuccess();
  };

  render() {
    return null;
  }
}

Data.propTypes = {
  createFlag: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  log: PropTypes.object.isRequired,

  setCreateFlag: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setLoadingMsg: PropTypes.func.isRequired,
  setLoadingMsgAlt: PropTypes.func.isRequired,
  setLoadingModal: PropTypes.func.isRequired,
  setLoadingSuccess: PropTypes.func.isRequired,
  setLoadingSuccessMsg: PropTypes.func.isRequired,

  updateChip: PropTypes.func.isRequired,
  setChipRemaining: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired
};

const mapState = state => ({
  createFlag: state.cardsCreate.createFlag,

  log: state.global.log,
  loading: state.loading.loading,
  onSuccess: state.loading.onSuccess
});

const mapDispatch = dispatch => ({
  setCreateFlag: dispatch.cardsCreate.setCreateFlag,

  setLoading: dispatch.loading.setLoading,
  setLoadingSuccess: dispatch.loading.setLoadingSuccess,
  setLoadingSuccessMsg: dispatch.loading.setLoadingSuccessMsg,
  setLoadingMsg: dispatch.loading.setLoadingMsg,
  setLoadingMsgAlt: dispatch.loading.setLoadingMsgAlt,
  setLoadingModal: dispatch.loading.setLoadingModal,

  updateChip: dispatch.chip.updateChip,
  setChipRemaining: dispatch.chip.setRemaining
});

export default connect(
  mapState,
  mapDispatch
)(withApollo(Data));
