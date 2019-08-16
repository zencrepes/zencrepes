import _ from "lodash";

import { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withApollo } from "react-apollo";

import GET_GITHUB_TEAMS from "../../../../graphql/getTeams.graphql";
import GET_GITHUB_TEAM_REPOSITORIES from "../../../../graphql/getTeamRepositories.graphql";
import GET_GITHUB_TEAM_MEMBERS from "../../../../graphql/getTeamMembers.graphql";

import { cfgSources } from "../../Minimongo.js";
import { cfgTeams } from "../../Minimongo.js";
import { cfgRepositories } from "../../Minimongo.js";

import calculateQueryIncrement from "../../utils/calculateQueryIncrement.js";

class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.errorRetry = 0;
    this.teamsCount = 0;
    this.reposCount = 0;
    this.membersCount = 0;
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
      loadRepos,
      log,
      onSuccess
    } = this.props;

    //Check if there if we are loading everything or just data for a subset of repositories
    let reposQuery = {};
    if (loadRepos.length > 0) {
      reposQuery = { id: { $in: loadRepos } };
    }

    let scanRepos = cfgSources
      .find(reposQuery)
      .fetch()
      .filter(repo => repo.active === true);
    const orgsGroups = _.groupBy(scanRepos, "org.id");
    const GitHubOrgs = [];
    for (let group of Object.values(orgsGroups)) {
      GitHubOrgs.push(group[0].org);
    }

    setLoading(true);
    setLoadingIterateTotal(
      scanRepos.filter(repo => repo.active === true).length
    );
    setLoadingIterateCurrent(0);
    await this.sleep(100); // This 100ms sleep allow for change of state for this.props.loading

    for (let org of GitHubOrgs) {
      log.info("Processing org: " + org.login);
      // First action is to clear all data associated with the organization, in both repositories and organizations

      log.info(
        "Flushing " +
          cfgTeams.find({ "org.id": org.id }).count() +
          " teams attached to this organization"
      );
      await cfgTeams.remove({ "org.id": org.id });

      log.info("Flushing all teams repositories attached to org: " + org.login);
      await this.clearReposTeam(org);

      setLoadingMsgAlt("Fetching teams from org: " + org.login);
      await this.getTeamsPagination(null, 10, org);
      incLoadingIterateCurrent(1);
      setLoadingSuccessMsg("Fetched " + this.teamsCount + " teams");
    }
    log.info(
      "Load completed: There is a total of " +
        cfgTeams.find({}).count() +
        " teams in memory"
    );

    // Fetching all repositories attached to teams
    for (let team of cfgTeams.find({}).fetch()) {
      log.info(
        "Starting to fetch repositories for team: " +
          team.name +
          " in: " +
          team.org.login
      );
      await this.getTeamRepositoriesPagination(null, 10, team);
    }

    // Fetching all members attached to teams
    for (let team of cfgTeams.find({}).fetch()) {
      log.info(
        "Starting to fetch members for team: " +
          team.name +
          " in: " +
          team.org.login
      );
      await this.getTeamMembersPagination(null, 10, team);
    }

    // Attaching teams to fetched repositories
    for (let team of cfgTeams.find({}).fetch()) {
      if (team.repositories !== undefined && team.repositories.totalCount > 0) {
        for (let repo of team.repositories.edges) {
          // Look for repo in repo object
          let findRepo = cfgRepositories.findOne({ id: repo.node.id });
          if (findRepo !== undefined) {
            if (findRepo.teams === undefined) {
              findRepo["teams"] = { totalCount: 0, edges: [] };
            }
            findRepo.teams.totalCount = findRepo.teams.totalCount + 1;
            findRepo.teams.edges.push({
              node: { ...team, permission: repo.permission }
            });
            await cfgRepositories.remove({ id: findRepo.id });
            await cfgRepositories.upsert(
              {
                id: findRepo.id
              },
              {
                $set: findRepo
              }
            );
          }
        }
      }
    }

    setLoadingSuccess(true);
    setLoading(false); // Set to true to indicate teams are done loading.
    this.teamsCount = 0;
    onSuccess();
  };

  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Clear all teams from an organization's repository
  clearReposTeam = async org => {
    const { log } = this.props;
    const repositories = cfgRepositories.find({ "org.id": org.id }).fetch();
    for (let repo of repositories) {
      if (repo.teams !== undefined && repo.teams.totalCount !== undefined) {
        log.info(
          "Repository: " +
            repo.name +
            " has " +
            repo.teams.totalCount +
            " teams, clearing"
        );
        const scanRepo = cfgRepositories.findOne({ id: repo.id });
        if (scanRepo !== undefined) {
          delete scanRepo["teams"];
          await cfgRepositories.remove({ id: repo.id });
          await cfgRepositories.upsert(
            {
              id: scanRepo.id
            },
            {
              $set: scanRepo
            }
          );
        }
      }
    }
  };

  getTeamsPagination = async (cursor, increment, orgObj) => {
    const { client, setLoading, log } = this.props;
    if (this.props.loading) {
      if (this.errorRetry <= 3) {
        let data = {};
        const t0 = performance.now();
        try {
          await this.sleep(1000); // Wait 2s between requests to avoid hitting GitHub API rate limit => https://developer.github.com/v3/guides/best-practices-for-integrators/
          data = await client.query({
            query: GET_GITHUB_TEAMS,
            variables: {
              team_cursor: cursor,
              team_increment: increment,
              org_name: orgObj.login
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
        log.info(orgObj);
        if (data.data !== null && data.data !== undefined) {
          this.errorRetry = 0;
          this.props.updateChip(data.data.rateLimit);
          // Check if the repository actually exist and teams were returned
          if (
            data.data.organization !== null &&
            data.data.organization.teams.edges.length > 0
          ) {
            let lastCursor = await this.ingestTeams(data, orgObj, callDuration);
            let loadedTeamsCount = cfgTeams
              .find({ "org.id": orgObj.id, refreshed: true })
              .count();
            let queryIncrement = calculateQueryIncrement(
              loadedTeamsCount,
              data.data.organization.teams.totalCount
            );
            log.info(
              "Loading teams for org:  " +
                orgObj.name +
                " - Query Increment: " +
                queryIncrement +
                " - Local Count: " +
                loadedTeamsCount +
                " - Remote Count: " +
                data.data.organization.teams.totalCount
            );
            if (queryIncrement > 0 && lastCursor !== null) {
              //Start recurring call, to load all teams from a repository
              await this.getTeamsPagination(lastCursor, queryIncrement, orgObj);
            }
          }
        } else {
          this.errorRetry = this.errorRetry + 1;
          log.info("Error loading content, current count: " + this.errorRetry);
          await this.getTeamsPagination(cursor, increment, orgObj);
        }
      } else {
        log.info("Got too many load errors, stopping");
        setLoading(false);
      }
    }
  };

  ingestTeams = async (data, orgObj, callDuration) => {
    const { setLoadingMsg, setLoadingMsgAlt, log } = this.props;

    let lastCursor = null;
    let stopLoad = false;

    if (data.data.organization.teams.edges.length > 0) {
      const apiPerf = Math.round(
        data.data.organization.teams.edges.length / (callDuration / 1000)
      );
      setLoadingMsgAlt(
        "Fetching teams from " +
          orgObj.login +
          " at a rate of " +
          apiPerf +
          " teams/s"
      );
    }

    log.info(data);
    for (var currentTeam of data.data.organization.teams.edges) {
      log.info(currentTeam);
      log.info("Loading team: " + currentTeam.node.name);
      let teamObj = currentTeam.node;
      teamObj["org"] = orgObj;

      await cfgTeams.remove({ id: teamObj.id });
      await cfgTeams.upsert(
        {
          id: teamObj.id
        },
        {
          $set: teamObj
        }
      );
      this.teamsCount = this.teamsCount + 1;
      setLoadingMsg(this.teamsCount + " teams loaded");
      lastCursor = currentTeam.cursor;
    }

    if (lastCursor === null) {
      log.info(
        "=> No more updates to load, will not be making another GraphQL call for this org"
      );
    }
    if (stopLoad === true) {
      lastCursor = null;
    }
    return lastCursor;
  };

  getTeamRepositoriesPagination = async (cursor, increment, teamObj) => {
    const { client, setLoading, log } = this.props;
    if (this.props.loading) {
      if (this.errorRetry <= 3) {
        let data = {};
        const t0 = performance.now();
        try {
          await this.sleep(1000); // Wait 2s between requests to avoid hitting GitHub API rate limit => https://developer.github.com/v3/guides/best-practices-for-integrators/
          data = await client.query({
            query: GET_GITHUB_TEAM_REPOSITORIES,
            variables: {
              cursor: cursor,
              increment: increment,
              team_id: teamObj.id
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
        log.info(teamObj);
        if (data.data !== null && data.data !== undefined) {
          this.errorRetry = 0;
          this.props.updateChip(data.data.rateLimit);
          // Check if the repository actually exist and teams were returned
          if (
            data.data.node !== null &&
            data.data.node.repositories.edges.length > 0
          ) {
            let lastCursor = await this.ingestTeamRepositories(
              data,
              teamObj,
              callDuration
            );
            let currentTeam = cfgTeams.findOne({ id: teamObj.id });
            let loadedTeamsCount = currentTeam.repositories.edges.length;
            let queryIncrement = calculateQueryIncrement(
              loadedTeamsCount,
              data.data.node.repositories.totalCount
            );
            log.info(
              "Loading teams for org:  " +
                teamObj.name +
                " - Query Increment: " +
                queryIncrement +
                " - Local Count: " +
                loadedTeamsCount +
                " - Remote Count: " +
                data.data.node.repositories.totalCount
            );
            if (queryIncrement > 0 && lastCursor !== null) {
              //Start recurring call, to load all teams from a repository
              await this.getTeamRepositoriesPagination(
                lastCursor,
                queryIncrement,
                teamObj
              );
            }
          }
        } else {
          this.errorRetry = this.errorRetry + 1;
          log.info("Error loading content, current count: " + this.errorRetry);
          await this.getTeamRepositoriesPagination(cursor, increment, teamObj);
        }
      } else {
        log.info("Got too many load errors, stopping");
        setLoading(false);
      }
    }
  };

  ingestTeamRepositories = async (data, teamObj, callDuration) => {
    const { setLoadingMsg, setLoadingMsgAlt, log } = this.props;

    let lastCursor = null;
    let stopLoad = false;

    if (data.data.node.repositories.edges.length > 0) {
      const apiPerf = Math.round(
        data.data.node.repositories.edges.length / (callDuration / 1000)
      );
      setLoadingMsgAlt(
        "Fetching team repos from team " +
          teamObj.name +
          " at a rate of " +
          apiPerf +
          " repos/s"
      );
    }

    log.info(data);

    const updatedTeamObj = cfgTeams.findOne({ id: teamObj.id });
    for (var currentRepo of data.data.node.repositories.edges) {
      if (updatedTeamObj["repositories"] === undefined) {
        updatedTeamObj["repositories"] = { totalCount: 0, edges: [] };
      }
      if (updatedTeamObj["repositories"]["edges"] === undefined) {
        updatedTeamObj["repositories"]["edges"] = [];
      }
      updatedTeamObj["repositories"]["totalCount"] =
        data.data.node.repositories.totalCount;
      updatedTeamObj["repositories"]["edges"].push(currentRepo);

      lastCursor = currentRepo.cursor;
    }

    await cfgTeams.remove({ id: teamObj.id });
    await cfgTeams.upsert(
      {
        id: teamObj.id
      },
      {
        $set: updatedTeamObj
      }
    );

    this.reposCount =
      this.reposCount + data.data.node.repositories.edges.length;
    setLoadingMsg(this.reposCount + " repository nodes loaded");

    if (lastCursor === null) {
      log.info(
        "=> No more updates to load, will not be making another GraphQL call for this org"
      );
    }
    if (stopLoad === true) {
      lastCursor = null;
    }
    return lastCursor;
  };

  getTeamMembersPagination = async (cursor, increment, teamObj) => {
    const { client, setLoading, log } = this.props;
    if (this.props.loading) {
      if (this.errorRetry <= 3) {
        let data = {};
        const t0 = performance.now();
        try {
          await this.sleep(1000); // Wait 2s between requests to avoid hitting GitHub API rate limit => https://developer.github.com/v3/guides/best-practices-for-integrators/
          data = await client.query({
            query: GET_GITHUB_TEAM_MEMBERS,
            variables: {
              cursor: cursor,
              increment: increment,
              team_id: teamObj.id
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
        log.info(teamObj);
        if (data.data !== null && data.data !== undefined) {
          this.errorRetry = 0;
          this.props.updateChip(data.data.rateLimit);
          // Check if the repository actually exist and teams were returned
          if (
            data.data.node !== null &&
            data.data.node.members.edges.length > 0
          ) {
            let lastCursor = await this.ingestTeamMembers(
              data,
              teamObj,
              callDuration
            );
            let currentTeam = cfgTeams.findOne({ id: teamObj.id });
            let loadedTeamsCount = currentTeam.members.edges.length;
            let queryIncrement = calculateQueryIncrement(
              loadedTeamsCount,
              data.data.node.members.totalCount
            );
            log.info(
              "Loading teams for org:  " +
                teamObj.name +
                " - Query Increment: " +
                queryIncrement +
                " - Local Count: " +
                loadedTeamsCount +
                " - Remote Count: " +
                data.data.node.members.totalCount
            );
            if (queryIncrement > 0 && lastCursor !== null) {
              //Start recurring call, to load all teams from a repository
              await this.getTeamMembersPagination(
                lastCursor,
                queryIncrement,
                teamObj
              );
            }
          }
        } else {
          this.errorRetry = this.errorRetry + 1;
          log.info("Error loading content, current count: " + this.errorRetry);
          await this.getTeamMembersPagination(cursor, increment, teamObj);
        }
      } else {
        log.info("Got too many load errors, stopping");
        setLoading(false);
      }
    }
  };

  ingestTeamMembers = async (data, teamObj, callDuration) => {
    const { setLoadingMsg, setLoadingMsgAlt, log } = this.props;

    let lastCursor = null;
    let stopLoad = false;

    if (data.data.node.members.edges.length > 0) {
      const apiPerf = Math.round(
        data.data.node.members.edges.length / (callDuration / 1000)
      );
      setLoadingMsgAlt(
        "Fetching team members from team " +
          teamObj.name +
          " at a rate of " +
          apiPerf +
          " members/s"
      );
    }

    log.info(data);

    const updatedTeamObj = cfgTeams.findOne({ id: teamObj.id });
    for (var currentMember of data.data.node.members.edges) {
      if (updatedTeamObj["members"] === undefined) {
        updatedTeamObj["members"] = { totalCount: 0, edges: [] };
      }
      if (updatedTeamObj["members"]["edges"] === undefined) {
        updatedTeamObj["members"]["edges"] = [];
      }
      updatedTeamObj["members"]["totalCount"] =
        data.data.node.members.totalCount;
      updatedTeamObj["members"]["edges"].push(currentMember);

      lastCursor = currentMember.cursor;
    }

    await cfgTeams.remove({ id: teamObj.id });
    await cfgTeams.upsert(
      {
        id: teamObj.id
      },
      {
        $set: updatedTeamObj
      }
    );

    this.membersCount = this.membersCount + data.data.node.members.edges.length;
    setLoadingMsg(this.membersCount + " member nodes loaded");

    if (lastCursor === null) {
      log.info(
        "=> No more updates to load, will not be making another GraphQL call for this org"
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
  loadRepos: PropTypes.array,

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
  loadFlag: state.teamsFetch.loadFlag,
  loadRepos: state.teamsFetch.loadRepos,

  log: state.global.log,

  loading: state.loading.loading,
  onSuccess: state.loading.onSuccess
});

const mapDispatch = dispatch => ({
  setLoadFlag: dispatch.teamsFetch.setLoadFlag,

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
