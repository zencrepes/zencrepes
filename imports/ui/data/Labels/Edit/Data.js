import { Meteor } from 'meteor/meteor';
import { Component } from 'react'

import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import {cfgLabels} from "../../Minimongo";

import GET_GITHUB_SINGLE_LABEL from '../../../../graphql/getSingleLabel.graphql';

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
        const { setLoadFlag, loadFlag, loading } = this.props;
        if (loadFlag && loading === false) {
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.load();            // Logic to load Issues
        }
    }

    load = async () => {
        const {
            client,
            setChipRemaining,
            labels,
            setLoading,
            setLoadingSuccess,
            setLoadingSuccessMsg,
            setLoadingModal,
            setLoadingMsg,
            setLoadingMsgAlt,
            action,
            newName,
            newDescription,
            newColor,
            log,
            onSuccess,
        } = this.props;
        setLoadingModal(true);
        setLoadingMsgAlt('');
        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadingSuccess(false);

        log.info(labels);
        for (let label of labels) {
            log.info(label);
            let result = false;
            if (action === 'create') {
                setLoadingMsg('Creating label ' + label.name + ' in ' + label.org.login + '/' + label.repo.name);
                let createPayload = {
                    owner: label.org.login,
                    repo: label.repo.name,
                    name: newName,
                    color: newColor,
                };
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
                    result = await this.octokit.issues.createLabel(createPayload);
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
                                org_name: label.org.login,
                                repo_name: label.repo.name,
                                label_name: newName
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
                        const labelObj = {
                            ...data.data.repository.label,
                            repo: label.repo,
                            org: label.org,
                        };
                        log.info(labelObj);
                        await cfgLabels.upsert({
                            id: labelObj.id
                        }, {
                            $set: labelObj
                        });
                    }
                }
            } else if (action === 'update') {
                setLoadingMsg('Updating label ' + label.name + ' in ' + label.org.login + '/' + label.repo.name);
                let updatePayload = {
                    owner: label.org.login,
                    repo: label.repo.name,
                    current_name: label.name,
                    name: newName,
                    color: newColor,
                };
                log.info(updatePayload);
                if (label.name === newName && label.color === newColor && label.description === newDescription) {
                    log.info('Nothing to be changed, not sending a request to GitHub');
                } else {
                    try {
                        if (newDescription !== null && newDescription.length > 0) {
                            updatePayload = {
                                ...updatePayload,
                                description: newDescription,
                                headers: {
                                    accept: 'application/vnd.github.symmetra-preview+json'
                                }
                            };
                        }
                        result = await this.octokit.issues.updateLabel(updatePayload);
                    }
                    catch (error) {
                        log.info(error);
                    }
                    if (result !== false) {
                        setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                        let updateName = label.name;
                        if (label.name !== newName) {
                            updateName = newName;
                        }
                        let data = {};
                        try {
                            data = await client.query({
                                query: GET_GITHUB_SINGLE_LABEL,
                                variables: {
                                    org_name: label.org.login,
                                    repo_name: label.repo.name,
                                    label_name: updateName
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
                            const labelObj = {
                                ...data.data.repository.label,
                                repo: label.repo,
                                org: label.org,
                            };
                            log.info(labelObj);
                            await cfgLabels.upsert({
                                id: labelObj.id
                            }, {
                                $set: labelObj
                            });
                        }
                    }
                }
            } else if (action === 'delete') {
                setLoadingMsg('Deleting label ' + label.name + ' from ' + label.org.login + '/' + label.repo.name);
                try {
                    result = await this.octokit.issues.deleteLabel({
                        owner: label.org.login,
                        repo: label.repo.name,
                        name: label.name,
                    });
                }
                catch (error) {
                    log.info(error);
                }
                log.info(result);
                if (result !== false) {
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                    cfgLabels.remove({id: label.id});
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
    labels: PropTypes.array.isRequired,

    newName: PropTypes.string,
    newDescription: PropTypes.string,
    newColor: PropTypes.string,

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
    loadFlag: state.labelsEdit.loadFlag,
    action: state.labelsEdit.action,

    newName: state.labelsEdit.newName,
    newDescription: state.labelsEdit.newDescription,
    newColor: state.labelsEdit.newColor,

    labels: state.labelsEdit.labels,

    log: state.global.log,
    loading: state.loading.loading,
    onSuccess: state.loading.onSuccess,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.labelsEdit.setLoadFlag,

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
