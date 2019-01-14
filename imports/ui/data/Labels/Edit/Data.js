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
            labels,
            setLoading,
            setLoadError,
            setLoadSuccess,
            setLoadedCount,
            action,
            newName,
            newDescription,
            newColor,
            log,
            onSuccess,
            incLoadedCount,
        } = this.props;

        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadError(false);
        setLoadSuccess(false);
        setLoadedCount(0);

        log.info(labels);
        for (let label of labels) {
            log.info(label);
            let result = false;
            if (action === 'update') {
                const updatePayload = {
                    owner: label.org.login,
                    repo: label.repo.name,
                    current_name: label.name,
                    name: newName,
                    color: newColor,
                    description: newDescription,
                };
                log.info(updatePayload);
                if (label.name === newName && label.color === newColor && label.description === newDescription) {
                    log.info('Nothing to be changed, not sending a request to GitHub');
                } else {
                    try {
                        result = await this.octokit.issues.updateLabel(updatePayload);
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
                                    label_name: label.name
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
            incLoadedCount(1);
        }
        setLoadSuccess(true);
        setLoading(false);
        onSuccess();
        /*
        if (action === 'update') {
            for (let repo of selectedRepos) {
                let result = false;
                // Test if label already exists
                let currentLabel = cfgLabels.findOne({name: selectedName, 'repo.id': repo});
                let currentRepo = cfgSources.findOne({id: repo});
                let updateObj = {
                    owner: currentRepo.org.login,
                    repo: currentRepo.name,
                }
                if (currentLabel !== undefined) {
                    updateObj['current_name'] = selectedName;
                    // This label exists, will be updating

                    if (updateName !== false && currentLabel.name !== newName) {
                        updateObj['name'] = newName;
                    }
                    if (updateColor !== false && currentLabel.color !== newColor.replace('#', '')) {
                        updateObj['color'] = newColor.replace('#', '');
                    }
                    if (updateDescription !== false && currentLabel.description !== newDescription) {
                        updateObj['description'] = newDescription;
                    }
                    if (!updateObj.hasOwnProperty('name') && !updateObj.hasOwnProperty('color') && !updateObj.hasOwnProperty('description')) {
                        log.info('Nothing to be changed, not sending a request to GitHub');
                    } else {
                        try {
                            result = await this.octokit.issues.updateLabel(updateObj);
                        }
                        catch (error) {
                            log.info(error);
                        }
                    }
                } else {
                    // This lable doesn't exist, will be creating
                    updateObj['name'] = newName;
                    if (updateName === false) {updateObj['name'] = selectedName;}

                    updateObj['color'] = newColor.replace('#', '');

                    if (updateDescription !== false) {updateObj['description'] = newDescription;}
                    try {
                        result = await this.octokit.issues.createLabel(updateObj);
                    }
                    catch (error) {
                        log.info(error);
                    }
                }
                log.info(result);
                if (result !== false) {
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                    let labelObj = {
                        id: result.data.node_id,
                        url: result.data.url,
                        color: result.data.color,
                        name: result.data.name,
                        isDefault: result.data.default,
                        repo: currentRepo,
                        refreshed: true,
                    };
                    if (updateDescription !== false) {
                        labelObj['description'] = newDescription;
                    }
                    await cfgLabels.upsert({
                        id: labelObj.id
                    }, {
                        $set: labelObj
                    });
                    incLoadedCount(1);
                }
            }
        } else if (action === 'delete') {
            for (let label of selectedLabels) {
                const result = await this.octokit.issues.deleteLabel({
                    owner: label.org.login,
                    repo: label.repo.name,
                    name: label.name
                });
                setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                cfgLabels.remove({id: label.id});
                incLoadedCount(1);
            }
        }
        */
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

    selectedRepos: PropTypes.array.isRequired,
    selectedLabels: PropTypes.array.isRequired,
    selectedName: PropTypes.string,

    newName: PropTypes.string,
    newDescription: PropTypes.string,
    newColor: PropTypes.string,

    setLoadFlag: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setLoadError: PropTypes.func.isRequired,
    setLoadSuccess: PropTypes.func.isRequired,
    setLoadedCount: PropTypes.func.isRequired,
    incLoadedCount: PropTypes.func.isRequired,
    updateChip: PropTypes.func.isRequired,
    setChipRemaining: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,

};

const mapState = state => ({
    loadFlag: state.labelsEdit.loadFlag,
    loading: state.labelsEdit.loading,
    action: state.labelsEdit.action,

    selectedRepos: state.labelsEdit.selectedRepos,
    selectedLabels: state.labelsEdit.selectedLabels,
    selectedName: state.labelsEdit.selectedName,

    newName: state.labelsEdit.newName,
    newDescription: state.labelsEdit.newDescription,
    newColor: state.labelsEdit.newColor,

    labels: state.labelsEdit.labels,

    log: state.global.log,
    onSuccess: state.labelsEdit.onSuccess,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.labelsEdit.setLoadFlag,
    setLoading: dispatch.labelsEdit.setLoading,
    setLoadError: dispatch.labelsEdit.setLoadError,
    setLoadSuccess: dispatch.labelsEdit.setLoadSuccess,

    setLoadedCount: dispatch.labelsEdit.setLoadedCount,
    incLoadedCount: dispatch.labelsEdit.incLoadedCount,

    updateChip: dispatch.chip.updateChip,
    setChipRemaining: dispatch.chip.setRemaining,
});

export default connect(mapState, mapDispatch)(withApollo(Data));
