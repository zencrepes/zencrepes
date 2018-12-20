import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { cfgLabels } from './Minimongo.js';

import GitHubApi from '@octokit/rest';

class Labels extends Component {
    constructor (props) {
        super(props);

        this.octokit = new GitHubApi();
        this.octokit.authenticate({
            type: 'oauth',
            token: Meteor.user().services.github.accessToken
        });

        this.state = {

        };
    }

    componentDidMount() {
        console.log('Labels - Initialized');

    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { setLoadFlag, loadFlag, loading} = this.props;

        if (loadFlag && loading === false) {
            setLoadFlag(false); // Right away set loadLabels to false
            this.loadLabels(); // Logic to load Labels
        }

    };

    loadLabels = async () => {
        const { setLoading, setLoadingText, setAction, action, selectedName, selectedRepos, setChipRemaining, updateName, updateDescription, updateColor, newName, newDescription, newColor, resetValues} = this.props;
        setLoading(true);  // Set labelsLoading to true to indicate labels are actually updating.

        //TODO - Test if repository is archived
        for (let repo of selectedRepos) {
            console.log('Processing: ' + repo.name);
            setLoadingText(repo.name);
            if (action === 'update') {
                let result = false;
                if (repo.label === undefined) {
                    console.log('Label does not exist in this repo, creating');

                    let labelName = newName;
                    if (updateName === false) {
                        labelName = selectedName;
                    }
                    let labelColor = newColor.replace('#', '');
                    let labelDescription = newDescription;
                    if (updateDescription === false) {
                        labelDescription = '';
                    }

                    try {
                        result = await this.octokit.issues.createLabel({
                            owner: repo.org.login,
                            repo: repo.name,
                            name: labelName,
                            color: labelColor,
                            description: labelDescription
                        });
                    }
                    catch (error) {
                        console.log(error);
                    }
                } else {
                    console.log('Label does exist, updating label: ' + selectedName);

                    let updateObj = {
                        owner: repo.org.login,
                        repo: repo.name,
                        current_name: selectedName,
                    };
                    if (updateName !== false && repo.label.name !== newName) {
                        updateObj['name'] = newName;
                    }
                    if (updateColor !== false && repo.label.color !== newColor.replace('#', '')) {
                        updateObj['color'] = newColor.replace('#', '');
                    }
                    if (updateDescription !== false && repo.label.description !== newDescription) {
                        updateObj['description'] = newDescription;
                    }

                    if (!updateObj.hasOwnProperty('name') && !updateObj.hasOwnProperty('color') && !updateObj.hasOwnProperty('description')) {
                        console.log('Nothing to be changed, not sending a request to GitHub');
                    } else {
                        console.log(updateObj);
                        try {
                            result = await this.octokit.issues.updateLabel(updateObj);
                        }
                        catch (error) {
                            console.log(error);
                        }
                    }
                }
                if (result !== false) {
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                    console.log(result);
                    let labelObj = {
                        id: result.data.node_id,
                        url: result.data.url,
                        color: result.data.color,
                        name: result.data.name,
                        isDefault: result.data.default,
                        repo: repo,
                        refreshed: true,
                    };
                    if (updateDescription !== false && repo.label.description !== newDescription) {
                        labelObj['description'] = newDescription;
                    }
                    await cfgLabels.upsert({
                        id: labelObj.id
                    }, {
                        $set: labelObj
                    });
                }
            } else if (action === 'delete') {
                console.log('Request to delete label');
                const result = await this.octokit.issues.deleteLabel({owner: repo.org.login, repo: repo.name, name: selectedName});
                setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                cfgLabels.remove({id:repo.label.id});
            }
        }
        console.log('Update completed: ' + selectedRepos.length + ' labels processed');
        setLoading(false);
        setAction(null); // Reset the action flag
        resetValues();
        this.props.history.push('/labels');
    };

    render() {
        return null;
    }
}

Labels.propTypes = {

};

const mapState = state => ({
    loadFlag: state.labelsEdit.loadFlag,
    loading: state.labelsEdit.loading,

    action: state.labelsEdit.action,

    selectedName: state.labelsEdit.selectedName,
    selectedRepos: state.labelsEdit.selectedRepos,

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
    setLoadingText: dispatch.labelsEdit.setLoadingText,

    setAction: dispatch.labelsEdit.setAction,

    resetValues: dispatch.labelsEdit.resetValues,

    setChipRemaining: dispatch.chip.setRemaining,
});

export default connect(mapState, mapDispatch)(withRouter(Labels));
