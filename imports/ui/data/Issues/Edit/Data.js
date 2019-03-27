import { Meteor } from 'meteor/meteor';
import { Component } from 'react'

import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import { cfgIssues } from "../../Minimongo";

import GET_GITHUB_SINGLE_ISSUE from '../../../../graphql/getSingleIssue.graphql';

import GitHubApi from '@octokit/rest';
import PropTypes from "prop-types";
import ingestIssue from "../../utils/ingestIssue";

class Data extends Component {
    constructor (props) {
        super(props);
        this.repositories = [];

        this.octokit = new GitHubApi();
        this.octokit.authenticate({
            type: 'oauth',
            token: Meteor.user().services.github.accessToken
        });
    }

    shouldComponentUpdate(nextProps) {
        const { loadFlag } = this.props;
        if (loadFlag !== nextProps.loadFlag) {
            return true;
        } else {
            return false;
        }
    }

    componentDidUpdate() {
        const { setLoadFlag, loadFlag, loading } = this.props;
        if (loadFlag, loading === false) {
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.load();            // Logic to load Issues
        }
    }

    load = async () => {
        const {
            issues,
            setLoading,
            setLoadingSuccess,
            setLoadingSuccessMsg,
            setLoadingModal,
            setLoadingMsg,
            setLoadingMsgAlt,
            action,
            log,
            onSuccess,
            agileLabels,
            agileNewState,
        } = this.props;
        setLoadingModal(true);
        setLoadingMsgAlt('');
        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadingSuccess(false);

        log.info(issues);
        log.info(action);
        for (let issue of issues) {
            log.info(issue);
            const updatedIssue = cfgIssues.findOne({id:issue.id});
            log.info(updatedIssue);
            if (action === 'updateStateLabel') {
                // Actions:
                //  - Determine if labels need update
                //  - Determine if state need update
                //  - Refresh issue

                setLoadingMsg('Updating issue ' + updatedIssue.title + ' in ' + updatedIssue.org.login + '/' + updatedIssue.repo.name);
                if (updatedIssue.state !== 'CLOSED' && agileNewState === 'closed') {
                    await this.updateIssueLabel(updatedIssue, agileLabels, null);
                    await this.updateIssueState(updatedIssue, 'closed');
                } else if (agileNewState === 'undefined') {
                    await this.updateIssueLabel(updatedIssue, agileLabels, null);
                } else {
                    await this.updateIssueLabel(updatedIssue, agileLabels, agileNewState);
                }
                if (updatedIssue.state === 'CLOSED' && agileNewState !== 'closed') {
                    await this.updateIssueState(updatedIssue, 'open');
                }
                await this.updateSingleIssue(updatedIssue);
            }
        }
        setLoadingSuccessMsg('Update Completed');
        setLoadingSuccess(true);
        setLoading(false);
        onSuccess();
    };

    updateIssueLabel = async (issue, agileLabels, agileNewState) => {
        const {
            log,
            setChipRemaining,
        } = this.props;

        let updateLabelPayload = {
            owner: issue.org.login,
            repo: issue.repo.name,
            number: issue.number,
        };
        let result = false;
        for (let label of agileLabels) {
            log.info(label);
            if (label.name === agileNewState) {
                if (updateLabelPayload.name !== undefined) {delete updateLabelPayload.name;}
                updateLabelPayload = {
                    ...updateLabelPayload,
                    labels: [label.name],
                };
                try {
                    result = await this.octokit.issues.addLabels(updateLabelPayload);
                }
                catch (error) {
                    log.info(error);
                }
                if (result !== false) {
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                }
            } else {
                // Check if label is already attached to issue, if yes, remove
                if (issue.labels.totalCount > 0 && issue.labels.edges.filter(lbl => lbl.node.name === label.name).length > 0) {
                    if (updateLabelPayload.labels !== undefined) {delete updateLabelPayload.labels;}
                    updateLabelPayload = {
                        ...updateLabelPayload,
                        name: label.name,
                    };
                    try {
                        result = await this.octokit.issues.removeLabel(updateLabelPayload);
                    }
                    catch (error) {
                        log.info(error);
                    }
                    if (result !== false) {
                        setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                    }
                }
            }
        }
    };

    updateIssueState = async (issue, newState) => {
        const {
            log,
            setChipRemaining,
        } = this.props;
        let result = false;

        let updateIssuePayload = {
            owner: issue.org.login,
            repo: issue.repo.name,
            number: issue.number,
            state: newState,
        };
        try {
            result = await this.octokit.issues.update(updateIssuePayload);
        }
        catch (error) {
            log.info(error);
        }
        if (result !== false) {
            setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
        }
    };


    updateSingleIssue = async (issue) => {
        const {
            client,
            log,
        } = this.props;
        let data = {};
        try {
            data = await client.query({
                query: GET_GITHUB_SINGLE_ISSUE,
                variables: {
                    org_name: issue.org.login,
                    repo_name: issue.repo.name,
                    issue_number: issue.number
                },
                fetchPolicy: 'no-cache',
                errorPolicy: 'ignore',
            });
        }
        catch (error) {
            log.warn(error);
        }
        log.info(data);
        if (data.data !== null && data.data !== undefined) {
            this.props.updateChip(data.data.rateLimit);
            if (data.data.repository.issue !== null) {
                await ingestIssue(cfgIssues, data.data.repository.issue, issue.repo, issue.org);
            }
        }
    };

    render() {
        return null;
    }
}

Data.propTypes = {
    loadFlag: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    action: PropTypes.string,
    log: PropTypes.object.isRequired,
    issues: PropTypes.array.isRequired,
    agileLabels: PropTypes.array.isRequired,
    agileNewState: PropTypes.string.isRequired,

    setLoadFlag: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setLoadingMsg: PropTypes.func.isRequired,
    setLoadingMsgAlt: PropTypes.func.isRequired,
    setLoadingModal: PropTypes.func.isRequired,
    setLoadingSuccess: PropTypes.func.isRequired,
    setLoadingSuccessMsg: PropTypes.func.isRequired,

    updateChip: PropTypes.func.isRequired,
    setChipRemaining: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
};

const mapState = state => ({
    loadFlag: state.issuesEdit.loadFlag,
    action: state.issuesEdit.action,

    issues: state.issuesEdit.issues,
    agileLabels: state.issuesEdit.agileLabels,
    agileNewState: state.issuesEdit.agileNewState,

    log: state.global.log,
    loading: state.loading.loading,
    onSuccess: state.loading.onSuccess,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.issuesEdit.setLoadFlag,

    setLoading: dispatch.loading.setLoading,
    setLoadingSuccess: dispatch.loading.setLoadingSuccess,
    setLoadingSuccessMsg: dispatch.loading.setLoadingSuccessMsg,
    setLoadingMsg: dispatch.loading.setLoadingMsg,
    setLoadingMsgAlt: dispatch.loading.setLoadingMsgAlt,
    setLoadingModal: dispatch.loading.setLoadingModal,

    updateChip: dispatch.chip.updateChip,
    setChipRemaining: dispatch.chip.setRemaining,
});

export default connect(mapState, mapDispatch)(withApollo(Data));
