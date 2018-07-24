import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import Promise from 'bluebird';

import GET_GITHUB_REPOS from '../../graphql/getReposExternal.graphql';

/*
export const cfgSources = new Mongo.Collection('cfgSources', {connection: null});
export const localCfgSources = new PersistentMinimongo2(cfgSources, 'GAV-Repos');
window.repos = cfgSources;
*/
import { cfgSources } from './Minimongo.js';

import calculateQueryIncrement from './calculateQueryIncrement.js';

/*
Load data about Github Orgs
 */
class ScanOrg extends Component {
    constructor (props) {
        super(props);
        this.repositories = [];
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { setLoadFlag, loadFlag } = this.props;
        if (loadFlag) {
            console.log('ScanOrg - Initiating load');
            setLoadFlag(false); // Right away set loadRepositories to false
            this.load();           // Logic to load Issues
        }
    };

    load = async () => {
        const { setLoading, name, setRepositories } = this.props;

        setLoading(true);  // Set loading to true to indicate content is actually loading.
        console.log('Getting repositories from Organization: ' + name);
        await this.getReposPagination(null, 10);
        setRepositories(this.repositories);
        setLoading(false);
    };

    getReposPagination = async (cursor, increment) => {
        const { client, updateChip, name } = this.props;

        let data = await client.query({
            query: GET_GITHUB_REPOS,
            variables: {repo_cursor: cursor, increment: increment, org_name: name},
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        });
        console.log(data);
        if (data.data.organization !== null) {
            updateChip(data.data.rateLimit);
            let lastCursor = await this.loadRepositories(data);
            let queryIncrement = calculateQueryIncrement(this.repositories.length, data.data.organization.repositories.totalCount);
            console.log(this.repositories);
            console.log('Current count: ' + this.repositories.length);
            console.log('Total count: ' + data.data.organization.repositories.totalCount);
            console.log('Query increment: ' + queryIncrement);
            if (queryIncrement > 0) {
                await this.getReposPagination(lastCursor, queryIncrement);
            }
        }
    };

    loadRepositories = async (data) => {
        let lastCursor = null;
        for (let [key, currentRepo] of Object.entries(data.data.organization.repositories.edges)) {
            console.log('Inserting: ' + currentRepo.node.name);
            let repoObj = {
                id: currentRepo.node.id,
                name: currentRepo.node.name,
                url: currentRepo.node.url,
                issues: currentRepo.node.issues,
                labels: currentRepo.node.labels,
                databaseId: currentRepo.node.databaseId,
                org: {
                    login: data.data.organization.login,
                    name: data.data.organization.name,
                    id: data.data.organization.id,
                    url: data.data.organization.url,
                }
            };
            this.repositories.push(repoObj);
            lastCursor = currentRepo.cursor
        }
        return lastCursor;
    };

    render() {
        return null;
    }
}

ScanOrg.propTypes = {

};

const mapState = state => ({
    loadFlag: state.githubScanOrg.loadFlag,
    loading: state.githubScanOrg.loading,

    name: state.githubScanOrg.name,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubScanOrg.setLoadFlag,
    setLoading: dispatch.githubScanOrg.setLoading,

    setRepositories: dispatch.githubScanOrg.setRepositories,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(ScanOrg));
