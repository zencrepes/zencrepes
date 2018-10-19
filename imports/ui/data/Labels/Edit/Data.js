import React, { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import {cfgLabels, cfgSources} from "../../Minimongo";

import GitHubApi from '@octokit/rest';

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

    shouldComponentUpdate(nextProps, nextState) {
        const { loadSuccess, loadFlag } = this.props;
        if (loadFlag !== nextProps.loadFlag) {
            return true;
        } else {
            return false;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { setLoadFlag, loadFlag } = this.props;
        if (loadFlag) {
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.load();            // Logic to load Issues
        }
    };

    load = async () => {
        const { client,
            setChipRemaining,
            setLoading,
            setLoadError,
            setLoadSuccess,
            setLoadedCount,
            selectedRepos,
            selectedLabels,
            action,
            selectedName,
            updateName,
            updateDescription,
            updateColor,
            newName,
            newDescription,
            newColor,
            incLoadedCount
        } = this.props;

        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadError(false);
        setLoadSuccess(false);
        setLoadedCount(0);

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
                        console.log('Nothing to be changed, not sending a request to Github');
                    } else {
                        try {
                            result = await this.octokit.issues.updateLabel(updateObj);
                        }
                        catch (error) {
                            console.log(error);
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
                        console.log(error);
                    }
                }
                console.log(result);
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
        setLoadSuccess(true);
        setLoading(false);
    };

    render() {
        return null;
    }
}

Data.propTypes = {

};

const mapState = state => ({
    loadFlag: state.labelsEdit.loadFlag,
    loading: state.labelsEdit.loading,
    action: state.labelsEdit.action,

    selectedRepos: state.labelsEdit.selectedRepos,
    selectedLabels: state.labelsEdit.selectedLabels,
    selectedName: state.labelsEdit.selectedName,

    updateName: state.labelsEdit.updateName,
    updateDescription: state.labelsEdit.updateDescription,
    updateColor: state.labelsEdit.updateColor,

    newName: state.labelsEdit.newName,
    newDescription: state.labelsEdit.newDescription,
    newColor: state.labelsEdit.newColor,

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
