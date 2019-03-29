import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_SINGLE_ISSUE from '../../../../../graphql/getSinglePullrequest.graphql';

import { cfgPullrequests, cfgSources } from '../../../Minimongo.js';
import ingestPullrequest from "../../../utils/ingestPullrequest.js";

class Staging extends Component {
    constructor (props) {
        super(props);
        this.verifErrors = 0;
    }

    componentDidUpdate = (prevProps) => {
        const { setVerifFlag, verifFlag, loading } = this.props;
        // Only trigger load if loadFlag transitioned from false to true
        if (verifFlag === true && prevProps.verifFlag === false && loading === false) {
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
            setLoadFlag,
            pullrequests,
            setVerifiedPullrequests,
            insVerifiedPullrequests,
            client,
            action,
            log,
            onSuccess,
        } = this.props;


        setLoading(true);
        setLoadingModal(false);
        setVerifiedPullrequests([]);
        this.verifErrors = 0;
        setLoadingMsg('About pull data from ' + pullrequests.length + ' pullrequests');
        setLoadingMsgAlt('');
        await this.sleep(100); // This 100ms sleep allow for change of state for this.props.loading
        for (const [idx, pullrequest] of pullrequests.entries()) {
            log.info(pullrequest);
            if (this.props.loading === true) {
                // First, verify if a pullrequest with this title already exists in the repo
                // TODO - To be replaced by checking of pullrequest title in case we want to edit
                if (cfgPullrequests.find({'title': 'TOBEREPLACEDBYISSUETITLE', 'repo.id' : pullrequest.repo.id}).count() > 0) {
                    insVerifiedPullrequests({
                        ...pullrequest,
                        error: true,
                        errorMsg: 'This pullrequest already exists in this repository. Please pick a different title.',
                    });
                    this.verifErrors++;
                } else if (action !== 'create') {
                    let baseMsg = (idx + 1) + '/' + pullrequests.length + ' - Fetching pullrequest: ' + pullrequest.org.login + '/' + pullrequest.repo.name + '#' + pullrequest.number;
                    setLoadingMsg(baseMsg);
                    log.info(baseMsg);
                    let data = {};
                    try {
                        data = await client.query({
                            query: GET_GITHUB_SINGLE_ISSUE,
                            variables: {
                                org_name: pullrequest.org.login,
                                repo_name: pullrequest.repo.name,
                                pullrequest_number: pullrequest.number
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
                        if (data.data !== undefined) {
                            this.props.updateChip(data.data.rateLimit);
                        }
                        if (data.data === undefined) {
                            // The repository doesn't exist anymore on GitHub.
                            insVerifiedPullrequests({
                                id: pullrequest.id,
                                error: true,
                                errorMsg: 'Unable to communicate with GitHub, please check your network connectivity',
                            });
                            log.info('Unable to communicate with GitHub, please check your network connectivity');
                            this.verifErrors++;
                        }
                        else if (data.data.repository === null) {
                            // The repository doesn't exist anymore on GitHub.
                            insVerifiedPullrequests({
                                id: pullrequest.id,
                                error: true,
                                errorMsg: 'This repository doesn\'t exist in GitHub currently. Was it deleted ?',
                            });
                            log.info('This repository doesn\'t exist in GitHub currently. Was it deleted ?');

                            await cfgPullrequests.remove({'id': pullrequest.id});
                            await cfgSources.update({id: pullrequest.repo.id}, {active: false}, {multi: false});
                            this.verifErrors++;
                        }
                        else if (data.data.repository.pullrequest === null && action !== 'create') {
                            insVerifiedPullrequests({
                                id: pullrequest.id,
                                error: true,
                                errorMsg: 'This pullrequest doesn\'t exist in GitHub currently. Was it deleted ?',
                            });
                            log.info('This pullrequest doesn\'t exist in GitHub currently. Was it deleted ?');

                            await cfgPullrequests.remove({'id': pullrequest.id});
                            this.verifErrors++;
                        }
                        else if (data.data.repository.pullrequest.id !== pullrequest.id && action !== 'create') {
                            insVerifiedPullrequests({
                                id: pullrequest.id,
                                error: true,
                                errorMsg: 'There seems to be an ID mismatch between your local copy and GitHub, please clear all your Pullrequests and reload. This can happen if a pullrequest was created with the same number than a previously deleted pullrequest.',
                            });
                            log.info('There seems to be an ID mismatch between your local copy and GitHub, please clear all your Pullrequests and reload. This can happen if a pullrequest was created with the same number than a previously deleted pullrequest.');
                            this.verifErrors++;
                        }
                        else {
                            if (data.data.repository.viewerPermission !== 'ADMIN' && data.data.repository.viewerPermission !== 'WRITE') {
                                // User doesn't have the permissions to perform a change
                                insVerifiedPullrequests({
                                    id: pullrequest.id,
                                    error: true,
                                    errorMsg: 'Your missing write permission on this repository. Your permission: ' + data.data.repository.viewerPermission,
                                });
                                log.info('Your missing write permission on this repository. Your permission: ' + data.data.repository.viewerPermission);
                                this.verifErrors++;
                            }
                            else {
                                insVerifiedPullrequests({
                                    ...data.data.repository.pullrequest,
                                    error: false,
                                })
                            }
                            const updatedPullrequest = await ingestPullrequest(cfgPullrequests, data.data.repository.pullrequest, pullrequest.repo, pullrequest.org);
                            if (updatedPullrequest.points !== null) {
                                log.info('This pullrequest has ' + updatedPullrequest.points + ' story points');
                            }
                            if (updatedPullrequest.boardState !== null) {
                                log.info('This pullrequest is in Agile State ' + updatedPullrequest.boardState.name);
                            }
                        }
                    }
                } else {
                    insVerifiedPullrequests({
                        ...pullrequest,
                        error: false,
                    });
                }
            }
        }

        setLoadingSuccess(true);
        setLoading(false);
        if (action === 'updateStateLabel') {
            setLoadFlag(true);
        } else {
            if (action === 'refresh') {
                setLoadingSuccessMsg('Completed with ' + this.verifErrors + ' update(s)');
            } else {
                setLoadingSuccessMsg('Completed with ' + this.verifErrors + ' error(s)');
            }
            onSuccess();
        }
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
    pullrequests: PropTypes.array.isRequired,

    setVerifFlag: PropTypes.func.isRequired,
    setLoadFlag: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    setPullrequests: PropTypes.func.isRequired,
    setVerifiedPullrequests: PropTypes.func.isRequired,
    insVerifiedPullrequests: PropTypes.func.isRequired,
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
    verifFlag: state.pullrequestsEdit.verifFlag,
    action: state.pullrequestsEdit.action,

    pullrequests: state.pullrequestsEdit.pullrequests,

    log: state.global.log,
    loading: state.loading.loading,
    onSuccess: state.loading.onSuccess,
});

const mapDispatch = dispatch => ({
    setVerifFlag: dispatch.pullrequestsEdit.setVerifFlag,
    setStageFlag: dispatch.pullrequestsEdit.setStageFlag,
    setLoadFlag: dispatch.pullrequestsEdit.setLoadFlag,
    setPullrequests: dispatch.pullrequestsEdit.setPullrequests,
    setVerifiedPullrequests: dispatch.pullrequestsEdit.setVerifiedPullrequests,
    insVerifiedPullrequests: dispatch.pullrequestsEdit.insVerifiedPullrequests,

    updateChip: dispatch.chip.updateChip,
    setLoading: dispatch.loading.setLoading,
    setLoadingMsg: dispatch.loading.setLoadingMsg,
    setLoadingMsgAlt: dispatch.loading.setLoadingMsgAlt,
    setLoadingModal: dispatch.loading.setLoadingModal,
    setLoadingSuccessMsg: dispatch.loading.setLoadingSuccessMsg,
    setLoadingSuccess: dispatch.loading.setLoadingSuccess,
});

export default connect(mapState, mapDispatch)(withApollo(Staging));