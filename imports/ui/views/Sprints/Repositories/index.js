import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import RepositoriesTable from './RepositoriesTable.js';

import CustomCard from "../../../components/CustomCard/index.js";
import AddRepos from '../../../components/Milestones/AddRepos/index.js';

import AddRepoButton from './AddRepoButton.js';
import DeleteEmptyButton from './DeleteEmptyButton.js';

class Repositories extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { repositories, updateView, milestones } = this.props;
        return (
            <CustomCard
                headerTitle="Milestones"
                headerFactTitle="Count"
                headerFactValue={repositories.length}
            >
                <AddRepos updateView={updateView} />
                <RepositoriesTable repositories={repositories} />
                <AddRepoButton milestones={milestones}/>
                <DeleteEmptyButton milestones={milestones}/>
            </CustomCard>
        );
    }
}

Repositories.propTypes = {
    repositories: PropTypes.array.isRequired,
    milestones: PropTypes.array.isRequired,

    updateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    repositories: state.sprintsView.repositories,
    milestones: state.sprintsView.milestones,
});

const mapDispatch = dispatch => ({
    updateView: dispatch.sprintsView.updateView,
});

export default connect(mapState, mapDispatch)(Repositories);
