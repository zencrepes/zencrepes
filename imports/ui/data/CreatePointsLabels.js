import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_SINGLEREPO from '../../graphql/getSingleRepo.graphql';

import { cfgSources } from './Minimongo.js';
import {cfgLabels} from "./Minimongo";
import fibonacci from "fibonacci-fast";

/*
Load data about Github Orgs
 */
class CreatePointsLabels extends Component {
    constructor (props) {
        super(props);
        this.repositories = [];
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { setLoadFlag, loadFlag } = this.props;
        if (loadFlag) {
            console.log('CreatePointsLabels - Initiating load');
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.load();            // Logic to load Issues
        }
    };

    load = async () => {
        const { client, updateChip, setLoading, setLoadError, setLoadSuccess, maxPoints, setIncrementCreatedLabels, setIncrementUpdatedRepos, setCreatedLabels, setUpdatedRepos } = this.props;

        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadError(false);
        setLoadSuccess(false);
        setCreatedLabels(0);
        setUpdatedRepos(0);

        let points = fibonacci.array(2, fibonacci.find(maxPoints).index + 1).map(x => 'SP:' + x.number.toString());
        console.log(points);
        let repos = cfgSources.find({active: true}).map(repo => {
            //Get Labels for repo
            let labels = cfgLabels.find({'repo.id': repo.id}).map(label => label.name);

            //TODO - Add code to create labels

            setIncrementUpdatedRepos(1);
            setIncrementCreatedLabels(labels.length);
            console.log(repo);
            console.log(labels);
        });


        setLoadSuccess(true);
        setLoading(false);
    };

    render() {
        return null;
    }
}

CreatePointsLabels.propTypes = {

};

const mapState = state => ({
    loadFlag: state.githubCreatePointsLabels.loadFlag,
    loading: state.githubCreatePointsLabels.loading,

    maxPoints: state.githubLabels.maxPoints,

});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubCreatePointsLabels.setLoadFlag,
    setLoading: dispatch.githubCreatePointsLabels.setLoading,
    setLoadError: dispatch.githubCreatePointsLabels.setLoadError,
    setLoadSuccess: dispatch.githubCreatePointsLabels.setLoadSuccess,

    setCreatedLabels: dispatch.githubCreatePointsLabels.setCreatedLabels,
    setUpdatedRepos: dispatch.githubCreatePointsLabels.setUpdatedRepos,
    setIncrementCreatedLabels: dispatch.githubCreatePointsLabels.setIncrementCreatedLabels,
    setIncrementUpdatedRepos: dispatch.githubCreatePointsLabels.setIncrementUpdatedRepos,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(CreatePointsLabels));
