import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_SINGLE_MILESTONE from '../../../../../graphql/getSingleMilestone.graphql';

import { cfgMilestones, cfgSources } from '../../../Minimongo.js';

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

    clearUnchanged = (action, milestones, newTitle, newState, newDueOn) => {
        if (action === 'delete' || action === 'create') {
            return milestones;
        } else {
            return milestones.filter((mls) => {
                if (mls.title === newTitle && mls.state === newState && mls.dueOn === newDueOn) {
                    return false;
                } else {
                    return true;
                }
            });
        }
    };

    load = async () => {
        const {
            setLoading,
            setLoadingModal,
            setLoadingMsg,
            setLoadingMsgAlt,
            setLoadingSuccessMsg,
            setLoadingSuccess,
            setStageFlag,
            setMilestones,
            milestones,
            setVerifiedMilestones,
            insVerifiedMilestones,
            client,
            action,
            log,
            newTitle,
            newState,
            newDueOn,
            onSuccess,
        } = this.props;

        //First, clear out all milestones that are not changing
        const milestonesToUpdate = this.clearUnchanged(action, milestones, newTitle, newState, newDueOn);
        setMilestones(milestonesToUpdate);

        if (milestonesToUpdate.length >0 ) {
            setLoading(true);
            setLoadingModal(false);
            setVerifiedMilestones([]);
            this.verifErrors = 0;
            setLoadingMsg('About pull data from ' + milestonesToUpdate.length + ' milestones');
            setLoadingMsgAlt('');
            await this.sleep(100); // This 100ms sleep allow for change of state for this.props.loading
            for (const [idx, milestone] of milestonesToUpdate.entries()) {
                log.info(milestone);
                if (this.props.loading === true) {
                    // First, verify if a milestone with this title already exists in the repo
                    if (cfgMilestones.find({'title': newTitle, 'repo.id' : milestone.repo.id}).count() > 0) {
                        insVerifiedMilestones({
                            ...milestone,
                            error: true,
                            errorMsg: 'This milestone already exists in this repository. Please pick a different title.',
                        });
                        this.verifErrors++;
                    } else if (action !== 'create') {
                        let baseMsg = (idx + 1) + '/' + milestones.length + ' - Fetching milestone: ' + milestone.org.login + '/' + milestone.repo.name + '#' + milestone.number;
                        setLoadingMsg(baseMsg);
                        let data = {};
                        try {
                            data = await client.query({
                                query: GET_GITHUB_SINGLE_MILESTONE,
                                variables: {
                                    org_name: milestone.org.login,
                                    repo_name: milestone.repo.name,
                                    milestone_number: milestone.number
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
                                insVerifiedMilestones({
                                    id: milestone.id,
                                    error: true,
                                    errorMsg: 'Unable to communicate with GitHub, please check your network connectivity',
                                });
                                this.verifErrors++;
                            }
                            else if (data.data.repository === null) {
                                // The repository doesn't exist anymore on GitHub.
                                insVerifiedMilestones({
                                    id: milestone.id,
                                    error: true,
                                    errorMsg: 'This repository doesn\'t exist in GitHub currently. Was it deleted ?',
                                });
                                await cfgMilestones.remove({'id': milestone.id});
                                await cfgSources.update({id: milestone.repo.id}, {active: false}, {multi: false});
                                this.verifErrors++;
                            }
                            else if (data.data.repository.viewerPermission !== 'ADMIN' && data.data.repository.viewerPermission !== 'WRITE') {
                                // The repository doesn't exist anymore on GitHub.
                                insVerifiedMilestones({
                                    id: milestone.id,
                                    error: true,
                                    errorMsg: 'Your missing write permission on this repository. Your permission: ' + data.data.repository.viewerPermission,
                                });
                                this.verifErrors++;
                            }
                            else if (data.data.repository.milestone === null && action !== 'create') {
                                insVerifiedMilestones({
                                    id: milestone.id,
                                    error: true,
                                    errorMsg: 'This milestone doesn\'t exist in GitHub currently. Was it deleted ?',
                                });
                                await cfgMilestones.remove({'id': milestone.id});
                                this.verifErrors++;
                            }
                            else if (data.data.repository.milestone.id !== milestone.id && action !== 'create') {
                                insVerifiedMilestones({
                                    id: milestone.id,
                                    error: true,
                                    errorMsg: 'There seems to be an ID mismatch between your local copy and GitHub, please clear all your Milestones and reload. This can happen if a milestone was created with the same number than a previously deleted milestone.',
                                });
                                this.verifErrors++;
                            }
                            else {
                                if (data.data.repository.milestone.updatedAt === milestone.updatedAt && data.data.repository.milestone.issues.totalCount === milestone.issues.totalCount) {
                                    insVerifiedMilestones({
                                        ...data.data.repository.milestone,
                                        error: false,
                                    })
                                }
                                else if (data.data.repository.milestone.updatedAt !== milestone.updatedAt) {
                                    insVerifiedMilestones({
                                        ...data.data.repository.milestone,
                                        error: true,
                                        errorMsg: 'This milestone has been modified in GitHub since it was last loaded locally. updatedAt dates are different',
                                    })

                                } else if (data.data.repository.milestone.issues.totalCount !== milestone.issues.totalCount) {
                                    insVerifiedMilestones({
                                        ...data.data.repository.milestone,
                                        error: true,
                                        errorMsg: 'This milestone has been modified in GitHub since it was last loaded locally. issues Counts are are different',
                                    })
                                }
                                await cfgMilestones.upsert({
                                    id: data.data.repository.milestone.id
                                }, {
                                    $set: data.data.repository.milestone
                                });
                            }
                        }
                    } else {
                        insVerifiedMilestones({
                            ...milestone,
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
        } else {
            setStageFlag(false);
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
    milestones: PropTypes.array.isRequired,

    setVerifFlag: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    setMilestones: PropTypes.func.isRequired,
    setVerifiedMilestones: PropTypes.func.isRequired,
    insVerifiedMilestones: PropTypes.func.isRequired,
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
    verifFlag: state.milestonesEdit.verifFlag,
    action: state.milestonesEdit.action,
    newTitle: state.milestonesEdit.newName,
    newState: state.milestonesEdit.newColor,
    newDueOn: state.milestonesEdit.newDescription,

    milestones: state.milestonesEdit.milestones,

    log: state.global.log,
    loading: state.loading.loading,
    onSuccess: state.loading.onSuccess,
});

const mapDispatch = dispatch => ({
    setVerifFlag: dispatch.milestonesEdit.setVerifFlag,
    setStageFlag: dispatch.milestonesEdit.setStageFlag,
    setMilestones: dispatch.milestonesEdit.setMilestones,
    setVerifiedMilestones: dispatch.milestonesEdit.setVerifiedMilestones,
    insVerifiedMilestones: dispatch.milestonesEdit.insVerifiedMilestones,

    updateChip: dispatch.chip.updateChip,
    setLoading: dispatch.loading.setLoading,
    setLoadingMsg: dispatch.loading.setLoadingMsg,
    setLoadingMsgAlt: dispatch.loading.setLoadingMsgAlt,
    setLoadingModal: dispatch.loading.setLoadingModal,
    setLoadingSuccessMsg: dispatch.loading.setLoadingSuccessMsg,
    setLoadingSuccess: dispatch.loading.setLoadingSuccess,
});

export default connect(mapState, mapDispatch)(withApollo(Staging));