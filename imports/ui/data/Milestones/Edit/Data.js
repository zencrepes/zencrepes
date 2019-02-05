import { Meteor } from 'meteor/meteor';
import { Component } from 'react'

import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import { cfgMilestones } from "../../Minimongo.js";

import GET_GITHUB_SINGLE_MILESTONE from '../../../../graphql/getSingleMilestone.graphql';

import GitHubApi from '@octokit/rest';
import PropTypes from 'prop-types';

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
            milestones,
            setLoading,
            setLoadingSuccess,
            setLoadingSuccessMsg,
            setLoadingModal,
            setLoadingMsg,
            setLoadingMsgAlt,
            action,
            newTitle,
            newDueOn,
//            newState,
            newDescription,
            log,
            onSuccess,
        } = this.props;

        setLoadingModal(true);
        setLoadingMsgAlt('');
        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadingSuccess(false);

        log.info(milestones);
        for (let milestone of milestones) {
            log.info(milestone);
            let result = false;
            if (action === 'create') {
                setLoadingMsg('Creating Milestone ' + milestone.title + ' in ' + milestone.org.login + '/' + milestone.repo.name);
                //To simplify implementation, for now creating is limited to the minimum required fields.
                let createPayload = {
                    owner: milestone.org.login,
                    repo: milestone.repo.name,
                    title: newTitle,
                };
                if (newDescription !== null) {
                    createPayload = {
                        ...createPayload,
                        description: newDescription
                    };
                }
                if (newDueOn !== null) {
                    createPayload = {
                        ...createPayload,
                        due_on: newDueOn
                    };
                }
                log.info(createPayload);
                try {
                    result = await this.octokit.issues.createMilestone(createPayload);
                }
                catch (error) {
                    log.info(error);
                }
                if (result !== false) {
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                    let data = {};
                    try {
                        data = await client.query({
                            query: GET_GITHUB_SINGLE_MILESTONE,
                            variables: {
                                org_name: milestone.org.login,
                                repo_name: milestone.repo.name,
                                milestone_number: result.data.number
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
                        const milestoneObj = {
                            ...data.data.repository.milestone,
                            repo: milestone.repo,
                            org: milestone.org,
                        };
                        log.info(milestoneObj);
                        await cfgMilestones.upsert({
                            id: milestoneObj.id
                        }, {
                            $set: milestoneObj
                        });
                    }
                }
            } else if (action === 'close') {
                setLoadingMsg('Closing Milestone ' + milestone.title + ' in ' + milestone.org.login + '/' + milestone.repo.name);
                try {
                    result = await this.octokit.issues.updateMilestone({
                        owner: milestone.org.login,
                        repo: milestone.repo.name,
                        number: milestone.number,
                        state: 'closed',
                    });
                }
                catch (error) {
                    log.info(error);
                }
                log.info(result);
                if (result !== false) {
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                    //incrementLoadedCount(1);
                    await cfgMilestones.update({
                        id: milestone.id
                    }, {
                        $set: {state: 'CLOSED'}
                    });
                }
            } else if (action === 'delete') {
                setLoadingMsg('Deleting Milestone ' + milestone.title + ' in ' + milestone.org.login + '/' + milestone.repo.name);
                try {
                    result = await this.octokit.issues.deleteMilestone({
                        owner: milestone.org.login,
                        repo: milestone.repo.name,
                        number: milestone.number,
                    });
                }
                catch (error) {
                    log.info(error);
                }
                log.info(result);
                if (result !== false) {
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                    cfgMilestones.remove({id: milestone.id});
                }
            } else if (action === 'update') {
                setLoadingMsg('Updating Milestone ' + milestone.title + ' in ' + milestone.org.login + '/' + milestone.repo.name);
                let updateMilestone = false;
                let updatePayload = {
                    owner: milestone.org.login,
                    repo: milestone.repo.name,
                    number: milestone.number,
                };
                if (newDescription !== milestone.description) {
                    updatePayload = {
                        ...updatePayload,
                        description: newDescription
                    };
                    updateMilestone = true;
                }
                if (newTitle !== milestone.title) {
                    updatePayload = {
                        ...updatePayload,
                        title: newTitle
                    };
                    updateMilestone = true;
                }
                if (newDueOn !== milestone.dueOn) {
                    updatePayload = {
                        ...updatePayload,
                        due_on: newDueOn
                    };
                    updateMilestone = true;
                }
                log.info(updatePayload);
                if (updateMilestone === false ) {
                    log.info('Nothing to be changed, not sending a request to GitHub');
                } else {
                    try {
                        result = await this.octokit.issues.updateMilestone(updatePayload);
                    }
                    catch (error) {
                        log.info(error);
                    }
                    if (result !== false) {
                        setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                        let data = {};
                        try {
                            data = await client.query({
                                query: GET_GITHUB_SINGLE_MILESTONE,
                                variables: {
                                    org_name: milestone.org.login,
                                    repo_name: milestone.repo.name,
                                    milestone_number: result.data.number
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
                            const milestoneObj = {
                                ...data.data.repository.milestone,
                                repo: milestone.repo,
                                org: milestone.org,
                            };
                            log.info(milestoneObj);
                            await cfgMilestones.upsert({
                                id: milestoneObj.id
                            }, {
                                $set: milestoneObj
                            });
                        }
                    }
                }
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
    milestones: PropTypes.array.isRequired,

    newTitle: PropTypes.string,
    newState: PropTypes.string,
    newDueOn: PropTypes.string,
    newDescription: PropTypes.string,

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
    loadFlag: state.milestonesEdit.loadFlag,
    action: state.milestonesEdit.action,

    milestones: state.milestonesEdit.milestones,

    newTitle: state.milestonesEdit.newTitle,
    newState: state.milestonesEdit.newState,
    newDueOn: state.milestonesEdit.newDueOn,
    newDescription: state.milestonesEdit.newDescription,

    log: state.global.log,
    loading: state.loading.loading,
    onSuccess: state.loading.onSuccess,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.milestonesEdit.setLoadFlag,

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
