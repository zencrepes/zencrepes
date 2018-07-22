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
                let labelColor = newColor;
                let labelDescription = newDescription;
                if (updateDescription === false) {
                    labelDescription = '';
                }

                const result = await this.octokit.issues.createLabel({
                    owner: repo.org.login,
                    repo: repo.name,
                    name: labelName,
                    color: 'ffffff',
                    description: 'this is a test description'
                });
                console.log(result);
                setChipRemaining(result.headers.x-ratelimit-remaining);
                //updateChip
                //updateChip(data.data.rateLimit);

            } else {
                console.log('Label does exist, updating');
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
