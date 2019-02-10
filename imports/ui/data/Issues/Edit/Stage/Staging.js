import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_SINGLE_ISSUE from '../../../../../graphql/getSingleIssue.graphql';

import { cfgIssues, cfgSources } from '../../../Minimongo.js';

class Staging extends Component {
    constructor (props) {
        super(props);
        this.verifErrors = 0;
    }

    componentDidUpdate = (prevProps) => {
        const { setVerifFlag, verifFlag } = this.props;
        // Only trigger load if loadFlag transitioned from false to true
        if (verifFlag === true && prevProps.verifFlag === false) {
            setVerifFlag(false);
            this.load();
        }
    };

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    load = async () => {
        const {
            setLoading,
            setLoadingModal,
            setLoadingMsg,
            setLoadingMsgAlt,
            setLoadingSuccessMsg,
            setLoadingSuccess,
            issues,
            setVerifiedIssues,
            insVerifiedIssues,
            client,
            action,
            log,
            onSuccess,
        } = this.props;


        setLoading(true);
        setLoadingModal(false);
        setVerifiedIssues([]);
        this.verifErrors = 0;
        setLoadingMsg('About pull data from ' + issues.length + ' issues');
        setLoadingMsgAlt('');
        await this.sleep(100); // This 100ms sleep allow for change of state for this.props.loading
        for (const [idx, issue] of issues.entries()) {
            log.info(issues);
            if (this.props.loading === true) {
                // First, verify if a issue with this title already exists in the repo
                // TODO - To be replaced by checking of issue title in case we want to edit
                if (cfgIssues.find({'title': 'TOBEREPLACEDBYISSUETITLE', 'repo.id' : issue.repo.id}).count() > 0) {
                    insVerifiedIssues({
                        ...issue,
                        error: true,
                        errorMsg: 'This issue already exists in this repository. Please pick a different title.',
                    });
                    this.verifErrors++;
                } else if (action !== 'create') {
                    let baseMsg = (idx + 1) + '/' + issues.length + ' - Fetching issue: ' + issue.org.login + '/' + issue.repo.name + '#' + issue.number;
                    setLoadingMsg(baseMsg);
                    log.info(baseMsg);
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
                    if (data.data !== null) {
                        if (data.data !== undefined) {
                            this.props.updateChip(data.data.rateLimit);
                        }
                        if (data.data === undefined) {
                            // The repository doesn't exist anymore on GitHub.
                            insVerifiedIssues({
                                id: issue.id,
                                error: true,
                                errorMsg: 'Unable to communicate with GitHub, please check your network connectivity',
                            });
                            this.verifErrors++;
                        }
                        else if (data.data.repository === null) {
                            // The repository doesn't exist anymore on GitHub.
                            insVerifiedIssues({
                                id: issue.id,
                                error: true,
                                errorMsg: 'This repository doesn\'t exist in GitHub currently. Was it deleted ?',
                            });
                            await cfgIssues.remove({'id': issue.id});
                            await cfgSources.update({id: issue.repo.id}, {active: false}, {multi: false});
                            this.verifErrors++;
                        }
                        else if (data.data.repository.viewerPermission !== 'ADMIN' && data.data.repository.viewerPermission !== 'WRITE') {
                            // The repository doesn't exist anymore on GitHub.
                            insVerifiedIssues({
                                id: issue.id,
                                error: true,
                                errorMsg: 'Your missing write permission on this repository. Your permission: ' + data.data.repository.viewerPermission,
                            });
                            this.verifErrors++;
                        }
                        else if (data.data.repository.issue === null && action !== 'create') {
                            insVerifiedIssues({
                                id: issue.id,
                                error: true,
                                errorMsg: 'This issue doesn\'t exist in GitHub currently. Was it deleted ?',
                            });
                            await cfgIssues.remove({'id': issue.id});
                            this.verifErrors++;
                        }
                        else if (data.data.repository.issue.id !== issue.id && action !== 'create') {
                            insVerifiedIssues({
                                id: issue.id,
                                error: true,
                                errorMsg: 'There seems to be an ID mismatch between your local copy and GitHub, please clear all your Issues and reload. This can happen if a issue was created with the same number than a previously deleted issue.',
                            });
                            this.verifErrors++;
                        }
                        else {
                            if (data.data.repository.issue.updatedAt === issue.updatedAt && data.data.repository.issue.issues.totalCount === issue.issues.totalCount) {
                                insVerifiedIssues({
                                    ...data.data.repository.issue,
                                    error: false,
                                })
                            }
                            else if (data.data.repository.issue.updatedAt !== issue.updatedAt) {
                                insVerifiedIssues({
                                    ...data.data.repository.issue,
                                    error: true,
                                    errorMsg: 'This issue has been modified in GitHub since it was last loaded locally. updatedAt dates are different',
                                })

                            } else if (data.data.repository.issue.issues.totalCount !== issue.issues.totalCount) {
                                insVerifiedIssues({
                                    ...data.data.repository.issue,
                                    error: true,
                                    errorMsg: 'This issue has been modified in GitHub since it was last loaded locally. issues Counts are are different',
                                })
                            }
                            await cfgIssues.upsert({
                                id: data.data.repository.issue.id
                            }, {
                                $set: data.data.repository.issue
                            });
                        }
                    }
                } else {
                    insVerifiedIssues({
                        ...issue,
                        error: false,
                    });
                }
            }
        }
        if (action === 'refresh') {
            setLoadingSuccessMsg('Completed with ' + this.verifErrors + ' update(s)');
        } else {
            setLoadingSuccessMsg('Completed with ' + this.verifErrors + ' error(s)');
        }
        setLoadingSuccess(true);
        setLoading(false);
        onSuccess();
    };

    render() {
        return null;
    }
}

Staging.propTypes = {
    verifFlag: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    action: PropTypes.string,
    newTitle: PropTypes.string,
    newState: PropTypes.string,
    newDueOn: PropTypes.string,
    issues: PropTypes.array.isRequired,

    setVerifFlag: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    setIssues: PropTypes.func.isRequired,
    setVerifiedIssues: PropTypes.func.isRequired,
    insVerifiedIssues: PropTypes.func.isRequired,
    updateChip: PropTypes.func.isRequired,

    log: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,

    onSuccess: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setLoadingMsg: PropTypes.func.isRequired,
    setLoadingMsgAlt: PropTypes.func.isRequired,
    setLoadingModal: PropTypes.func.isRequired,
    setLoadingSuccessMsg: PropTypes.func.isRequired,
    setLoadingSuccess: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifFlag: state.issuesEdit.verifFlag,
    action: state.issuesEdit.action,

    issues: state.issuesEdit.issues,

    log: state.global.log,
    loading: state.loading.loading,
    onSuccess: state.loading.onSuccess,
});

const mapDispatch = dispatch => ({
    setVerifFlag: dispatch.issuesEdit.setVerifFlag,
    setStageFlag: dispatch.issuesEdit.setStageFlag,
    setIssues: dispatch.issuesEdit.setIssues,
    setVerifiedIssues: dispatch.issuesEdit.setVerifiedIssues,
    insVerifiedIssues: dispatch.issuesEdit.insVerifiedIssues,

    updateChip: dispatch.chip.updateChip,
    setLoading: dispatch.loading.setLoading,
    setLoadingMsg: dispatch.loading.setLoadingMsg,
    setLoadingMsgAlt: dispatch.loading.setLoadingMsgAlt,
    setLoadingModal: dispatch.loading.setLoadingModal,
    setLoadingSuccessMsg: dispatch.loading.setLoadingSuccessMsg,
    setLoadingSuccess: dispatch.loading.setLoadingSuccess,
});

export default connect(mapState, mapDispatch)(withApollo(Staging));