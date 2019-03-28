import { Meteor } from 'meteor/meteor';
import { Component } from 'react'

import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import { cfgPullrequests } from "../../Minimongo";

import GET_GITHUB_SINGLE_ISSUE from '../../../../graphql/getSinglePullrequest.graphql';

import GitHubApi from '@octokit/rest';
import PropTypes from "prop-types";
import ingestPullrequest from "../../utils/ingestPullrequest";

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
            this.load();            // Logic to load Pullrequests
        }
    }

    load = async () => {
        const {
            pullrequests,
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

        log.info(pullrequests);
        log.info(action);
        for (let pullrequest of pullrequests) {
            log.info(pullrequest);
            const updatedPullrequest = cfgPullrequests.findOne({id:pullrequest.id});
            log.info(updatedPullrequest);
            if (action === 'updateStateLabel') {
                // Actions:
                //  - Determine if labels need update
                //  - Determine if state need update
                //  - Refresh pullrequest

                setLoadingMsg('Updating pullrequest ' + updatedPullrequest.title + ' in ' + updatedPullrequest.org.login + '/' + updatedPullrequest.repo.name);
                if (updatedPullrequest.state !== 'CLOSED' && agileNewState === 'closed') {
                    await this.updatePullrequestLabel(updatedPullrequest, agileLabels, null);
                    await this.updatePullrequestState(updatedPullrequest, 'closed');
                } else if (agileNewState === 'undefined') {
                    await this.updatePullrequestLabel(updatedPullrequest, agileLabels, null);
                } else {
                    await this.updatePullrequestLabel(updatedPullrequest, agileLabels, agileNewState);
                }
                if (updatedPullrequest.state === 'CLOSED' && agileNewState !== 'closed') {
                    await this.updatePullrequestState(updatedPullrequest, 'open');
                }
                await this.updateSinglePullrequest(updatedPullrequest);
            }
        }
        setLoadingSuccessMsg('Update Completed');
        setLoadingSuccess(true);
        setLoading(false);
        onSuccess();
    };

    updatePullrequestLabel = async (pullrequest, agileLabels, agileNewState) => {
        const {
            log,
            setChipRemaining,
        } = this.props;

        let updateLabelPayload = {
            owner: pullrequest.org.login,
            repo: pullrequest.repo.name,
            number: pullrequest.number,
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
                    result = await this.octokit.pullrequests.addLabels(updateLabelPayload);
                }
                catch (error) {
                    log.info(error);
                }
                if (result !== false) {
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                }
            } else {
                // Check if label is already attached to pullrequest, if yes, remove
                if (pullrequest.labels.totalCount > 0 && pullrequest.labels.edges.filter(lbl => lbl.node.name === label.name).length > 0) {
                    if (updateLabelPayload.labels !== undefined) {delete updateLabelPayload.labels;}
                    updateLabelPayload = {
                        ...updateLabelPayload,
                        name: label.name,
                    };
                    try {
                        result = await this.octokit.pullrequests.removeLabel(updateLabelPayload);
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

    updatePullrequestState = async (pullrequest, newState) => {
        const {
            log,
            setChipRemaining,
        } = this.props;
        let result = false;

        let updatePullrequestPayload = {
            owner: pullrequest.org.login,
            repo: pullrequest.repo.name,
            number: pullrequest.number,
            state: newState,
        };
        try {
            result = await this.octokit.pullrequests.update(updatePullrequestPayload);
        }
        catch (error) {
            log.info(error);
        }
        if (result !== false) {
            setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
        }
    };


    updateSinglePullrequest = async (pullrequest) => {
        const {
            client,
            log,
        } = this.props;
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
            this.props.updateChip(data.data.rateLimit);
            if (data.data.repository.pullrequest !== null) {
                await ingestPullrequest(cfgPullrequests, data.data.repository.pullrequest, pullrequest.repo, pullrequest.org);
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
    pullrequests: PropTypes.array.isRequired,
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
    loadFlag: state.pullrequestsEdit.loadFlag,
    action: state.pullrequestsEdit.action,

    pullrequests: state.pullrequestsEdit.pullrequests,
    agileLabels: state.pullrequestsEdit.agileLabels,
    agileNewState: state.pullrequestsEdit.agileNewState,

    log: state.global.log,
    loading: state.loading.loading,
    onSuccess: state.loading.onSuccess,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.pullrequestsEdit.setLoadFlag,

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
