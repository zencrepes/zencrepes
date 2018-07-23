import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

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
        const { setLoading, selectedName, selectedRepos, setChipRemaining, updateName, updateDescription, updateColor, newName, newDescription, newColor} = this.props;
        setLoading(true);  // Set labelsLoading to true to indicate labels are actually updating.

        for (let repo of selectedRepos) {
            console.log('Processing: ' + repo.name);

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

                const result = await this.octokit.issues.createLabel({
                    owner: repo.org.login,
                    repo: repo.name,
                    name: labelName,
                    color: labelColor,
                    description: labelDescription
                });

            } else {
                console.log('Label does exist, updating');

                updateObj = {
                    owner: repo.org.login,
                    repo: repo.name,
                    name: selectedName,
                };
                if (updateName !== false) {
                    updateObj['name'] = newName;
                }
                if (updateColor !== false) {
                    updateObj['color'] = newColor;
                }
                if (updateDescription !== false) {
                    updateObj['name'] = newDescription;
                }

                const result = await octokit.issues.updateLabel({updateObj})
            }
            
            if (result !== undefined) {
                setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                console.log(result);

                let labelObj = {
                    id: result.data.node_id,
                    url: result.data.url,
                    color: result.data.color,
                    name: result.data.name,
                    description: result.data.description,
                    isDefault: result.data.default,
                    repo: repo,
                    issues: 0,
                    refreshed: true,
                };
                await cfgLabels.upsert({
                    id: labelObj.id
                }, {
                    $set: labelObj
                });

                //updateChip
                //updateChip(data.data.rateLimit);

            }

            /*
            let response = await axios({
                method: 'get',
                url: 'https://api.zenhub.io/p1/repositories/' + repo.databaseId + '/board',
                responseType:'json',
                headers: {'X-Authentication-Token': token},
            });



            */

        }

        console.log('Update completed: ' + selectedRepos.length + ' labels process');
        setLoading(false);
    };

    render() {
        return null;
    }
}

Labels.propTypes = {

};

const mapState = state => ({
    loadFlag: state.labelsconfiguration.loadFlag,
    loading: state.labelsconfiguration.loading,

    selectedName: state.labelsconfiguration.selectedName,
    selectedRepos: state.labelsconfiguration.selectedRepos,

    updateName: state.labelsconfiguration.updateName,
    updateDescription: state.labelsconfiguration.updateDescription,
    updateColor: state.labelsconfiguration.updateColor,

    newName: state.labelsconfiguration.newName,
    newDescription: state.labelsconfiguration.newDescription,
    newColor: state.labelsconfiguration.newColor,

});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.labelsconfiguration.setLoadFlag,
    setLoading: dispatch.labelsconfiguration.setLoading,

    setChipRemaining: dispatch.chip.setRemaining,
});

export default connect(mapState, mapDispatch)(withApollo(Labels));
