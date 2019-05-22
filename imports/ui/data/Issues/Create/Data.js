import { Meteor } from 'meteor/meteor';
import { Component } from 'react'

import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import {cfgIssues} from "../../Minimongo";

import GET_GITHUB_SINGLE_ISSUE from '../../../../graphql/getSingleIssue.graphql';

import GitHubApi from '@octokit/rest';
import PropTypes from "prop-types";
import ingestIssue from "../../utils/ingestIssue.js";

class Data extends Component {
    constructor (props) {
        super(props);
        this.repositories = [];

        this.octokit = new GitHubApi();
        this.octokit.authenticate({
            type: 'oauth',
            token: Meteor.user().services.github.accessToken
        });
        this.updatedIssuesIds = [];
        this.errorCount = 0;
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
        if (loadFlag && loading === false) {
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.load();            // Logic to load Issues
        }
    }

    openIssuesList = () => {
        const { setUpdateQueryPath, setUpdateQuery } = this.props;
        const query = {'id': {'$in': this.updatedIssuesIds}};
        setUpdateQuery(query);
        setUpdateQueryPath('/issues/list');
    };

    load = async () => {
        const {
            client,
            setChipRemaining,
            issues,
            setLoading,
            setLoadingSuccess,
            setLoadingSuccessMsg,
            setLoadingModal,
            setLoadingMsg,
            setLoadingMsgAlt,
            log,
        } = this.props;
        setLoadingModal(true);
        setLoadingMsgAlt('');
        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadingSuccess(false);
        this.errorCount = 0;
        log.info(issues);
        this.updatedIssuesIds = [];
        for (let issue of issues) {
            log.info(issue);
            let result = false;
            setLoadingMsg('Creating issue ' + issue.title + ' in ' + issue.org.login + '/' + issue.repo.name);

            let createPayload = {
                owner: issue.org.login,
                repo: issue.repo.name,
                title: issue.title,
                headers: {
                    accept: 'application/vnd.github.symmetra-preview+json'
                }
            };

            if (issue.body !== undefined && issue.body.length > 0) {
                createPayload = {
                    ...createPayload,
                    body: issue.body
                };
            }

            if (issue.labels !== undefined && issue.labels.length > 0) {
                createPayload = {
                    ...createPayload,
                    labels: issue.labels.map(label => label.name)
                };
            }
            if (issue.assignees !== undefined && issue.assignees.length > 0) {
                createPayload = {
                    ...createPayload,
                    assignees: issue.assignees.map(assignee => assignee.login)
                };
            }
            if (issue.milestone !== undefined && issue.assignees !== null) {
                createPayload = {
                    ...createPayload,
                    milestone: issue.milestone.number
                };
            }
            log.info(createPayload);
            try {
                result = await this.octokit.issues.create(createPayload);
            } catch (error) {
                log.info(error);
            }
            log.info(result);
            if (result !== false) {
                setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                let data = {};
                let failureCount = 0;
                for (let i = 0; i < 4; i++) {
                    if (data.data === undefined) {
                        if (i > 0) {
                            failureCount++;
                            log.info('Failed loading data - retry #' + failureCount);
                        }
                        try {
                            data = await client.query({
                                query: GET_GITHUB_SINGLE_ISSUE,
                                variables: {
                                    issue_array: [result.data.node_id]
                                },
                                fetchPolicy: 'no-cache',
                                errorPolicy: 'ignore',
                            });
                        }
                        catch (error) {
                            log.warn(error);
                        }
                    } else {
                        failureCount = 0;
                    }
                }
                log.info(data);
                if (data.data !== undefined) {
                    this.props.updateChip(data.data.rateLimit);
                }
                if (data.data !== null ) {
                    for (const foundIssue of data.data.nodes) {
                        if (issue !== null) {
                            const updatedIssue = await ingestIssue(cfgIssues, foundIssue, issue.repo, issue.org);
                            this.updatedIssuesIds.push(updatedIssue.id);
                        }
                    }
                } else {
                    this.errorCount++;
                }
            }
        }
        setLoadingSuccessMsg('Creation completed (' + this.errorCount + ' errors)');
        setLoadingSuccess(true);
        setLoading(false);
        this.openIssuesList();
    };

    render() {
        return null;
    }
}

Data.propTypes = {
    loadFlag: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    log: PropTypes.object.isRequired,
    issues: PropTypes.array.isRequired,

    setLoadFlag: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setLoadingMsg: PropTypes.func.isRequired,
    setLoadingMsgAlt: PropTypes.func.isRequired,
    setLoadingModal: PropTypes.func.isRequired,
    setLoadingSuccess: PropTypes.func.isRequired,
    setLoadingSuccessMsg: PropTypes.func.isRequired,

    updateChip: PropTypes.func.isRequired,
    setChipRemaining: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,

    setUpdateQueryPath: PropTypes.func.isRequired,
    setUpdateQuery: PropTypes.func.isRequired,
};

const mapState = state => ({
    loadFlag: state.issuesCreate.loadFlag,

    issues: state.issuesCreate.issues,

    log: state.global.log,
    loading: state.loading.loading,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.issuesCreate.setLoadFlag,

    setLoading: dispatch.loading.setLoading,
    setLoadingSuccess: dispatch.loading.setLoadingSuccess,
    setLoadingSuccessMsg: dispatch.loading.setLoadingSuccessMsg,
    setLoadingMsg: dispatch.loading.setLoadingMsg,
    setLoadingMsgAlt: dispatch.loading.setLoadingMsgAlt,
    setLoadingModal: dispatch.loading.setLoadingModal,

    updateChip: dispatch.chip.updateChip,
    setChipRemaining: dispatch.chip.setRemaining,

    setUpdateQueryPath: dispatch.global.setUpdateQueryPath,
    setUpdateQuery: dispatch.global.setUpdateQuery,
});

export default connect(mapState, mapDispatch)(withApollo(Data));
