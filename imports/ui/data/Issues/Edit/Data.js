import { Meteor } from 'meteor/meteor';
import { Component } from 'react'

import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import { cfgIssues } from "../../Minimongo";

import GET_GITHUB_SINGLE_ISSUE from '../../../../graphql/getSingleIssue.graphql';

import GitHubApi from '@octokit/rest';
import PropTypes from "prop-types";

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
        const { setLoadFlag, loadFlag } = this.props;
        if (loadFlag) {
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.load();            // Logic to load Issues
        }
    }

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
            action,
            log,
            onSuccess,
        } = this.props;
        setLoadingModal(true);
        setLoadingMsgAlt('');
        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadingSuccess(false);

        log.info(issues);
        for (let issue of issues) {
            log.info(issue);
            let result = false;
            if (action === 'close') {
                setLoadingMsg('Closing issue ' + issue.name + ' in ' + issue.org.login + '/' + issue.repo.name);
                // Closing an issue is done in 2 steps
                // 1- Remove any labels that might be associated with an agile state
                // 2- Close the actual issue

                //Find labels

                let createPayload = {
                    owner: issue.org.login,
                    repo: issue.repo.name,
                    number: issue.number.name,
                };
/*
                //By default, if no-color is set, assigning white
                if (newColor === '' || newColor === null) {
                    createPayload = {
                        ...createPayload,
                        color: 'ffffff'
                    };
                }
                log.info(createPayload);
                try {
                    if (newDescription !== null && newDescription.length > 0) {
                        createPayload = {
                            ...createPayload,
                            description: newDescription,
                            headers: {
                                accept: 'application/vnd.github.symmetra-preview+json'
                            }
                        };
                    }
                    result = await this.octokit.issues.createIssue(createPayload);
                }
                catch (error) {
                    log.info(error);
                }
                if (result !== false) {
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                    let data = {};
                    try {
                        data = await client.query({
                            query: GET_GITHUB_SINGLE_LABEL,
                            variables: {
                                org_name: issue.org.login,
                                repo_name: issue.repo.name,
                                issue_name: newName
                            },
                            fetchPolicy: 'no-cache',
                            errorPolicy: 'ignore',
                        });
                    }
                    catch (error) {
                        log.info(error);
                    }
                    log.info(data);
                    if (data.data !== null) {
                        const issueObj = {
                            ...data.data.repository.issue,
                            repo: issue.repo,
                            org: issue.org,
                        };
                        log.info(issueObj);
                        await cfgIssues.upsert({
                            id: issueObj.id
                        }, {
                            $set: issueObj
                        });
                    }
                }
                */
            } else if (action === 'update') {
                setLoadingMsg('Updating issue ' + issue.name + ' in ' + issue.org.login + '/' + issue.repo.name);
                
            } else if (action === 'delete') {
                setLoadingMsg('Deleting issue ' + issue.name + ' from ' + issue.org.login + '/' + issue.repo.name);

            }
        }
        setLoadingSuccessMsg('Update Completed');
        setLoadingSuccess(true);
        setLoading(false);
        onSuccess();
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
