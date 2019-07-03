import _ from "lodash";
import { cfgProjects, cfgCards } from "../../../data/Minimongo.js";

export default {
  state: {
    loadFlag: false, // Boolean to trigger cards load
    createFlag: false, // Boolean to trigger cards creation

    projects: [], // Array of issues used for issues creation/closing. - Format for due date: Format: YYYY-MM-DDTHH:MM:SSZ
    verifiedIssues: [], // Array of issues that were updated in GitHub
    verifFlag: false, // Flag to trigger verification against GitHub

    action: null, // Action to be performed

    agileLabels: [], // Agile labels available to the issue
    agileNewState: "", //

    showCopyCards: false,
    copyProjectSource: { id: "none" },
    copyProjectDestination: { id: "none" },
    createConfirmModal: false,
    createCardsCount: 0
  },

  reducers: {
    setLoadFlag(state, payload) {
      return { ...state, loadFlag: payload };
    },
    setCreateFlag(state, payload) {
      return { ...state, createFlag: payload };
    },
    setStageFlag(state, payload) {
      return { ...state, stageFlag: payload };
    },

    setProjects(state, payload) {
      return { ...state, projects: payload };
    },

    setCopyProjectSource(state, payload) {
      return { ...state, copyProjectSource: payload };
    },

    setCopyProjectDestination(state, payload) {
      return { ...state, copyProjectDestination: payload };
    },

    setVerifiedIssues(state, payload) {
      return { ...state, verifiedIssues: payload };
    },
    insVerifiedIssues(state, payload) {
      let newArray = state.verifiedIssues.slice();
      newArray.splice(newArray.length, 0, payload);
      return { ...state, verifiedIssues: newArray };
    },
    setVerifFlag(state, payload) {
      return { ...state, verifFlag: payload };
    },

    setAction(state, payload) {
      return { ...state, action: payload };
    },
    setAgileLabels(state, payload) {
      return { ...state, agileLabels: payload };
    },
    setAgileNewState(state, payload) {
      return { ...state, agileNewState: payload };
    },

    setShowCopyCards(state, payload) {
      return { ...state, showCopyCards: payload };
    },
    setCreateConfirmModal(state, payload) {
      return { ...state, createConfirmModal: payload };
    },
    setCreateCardsCount(state, payload) {
      return { ...state, createCardsCount: payload };
    }
  },

  effects: {
    async initView() {
      const projects = cfgProjects.find({ state: "OPEN" }).fetch();
      this.setProjects(
        _.sortBy(projects, [
          project => {
            let repoName = "";
            if (project.repo !== null) {
              repoName = "/" + project.repo.name;
            }
            const repoStr = project.org.login + repoName + " - " + project.name;
            return repoStr.toLowerCase();
          }
        ])
      );
      this.setCreateCardsCount(0);
    },

    async updateCopyProjectSource(projectId) {
      if (projectId !== "none") {
        this.setCopyProjectSource(cfgProjects.findOne({ id: projectId }));
      } else {
        this.setCopyProjectSource({ id: "none" });
      }
    },

    async updateCopyProjectDestination(projectId) {
      if (projectId !== "none") {
        this.setCopyProjectDestination(cfgProjects.findOne({ id: projectId }));
      } else {
        this.setCopyProjectDestination({ id: "none" });
      }
    },

    async preparePushCards(payload, rootState) {
      // Add the destination column ID or delete card if the destination column doesn't exist
      const sourceCards = cfgCards.find().fetch();
      for (let card of sourceCards) {
        const columnName = card.column.name;
        const destinationColumn = rootState.cardsCreate.copyProjectDestination.columns.edges.find(
          col => col.node.name === columnName
        );
        if (destinationColumn === undefined) {
          // If the destination column cannot be found, delete the record
          cfgCards.remove({ id: card.id });
        } else {
          await cfgCards.upsert(
            {
              id: card.id
            },
            {
              $set: { ...card, destinationColumn: destinationColumn.node }
            }
          );
        }
      }
      this.setCreateCardsCount(cfgCards.find().count());
      this.setCreateConfirmModal(true);
    },

    async updateCardsCreated() {
      cfgCards.remove({});
      this.setShowCopyCards(false);
    }
  }
};
