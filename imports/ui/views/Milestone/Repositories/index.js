import React, { Component } from 'react';
import { connect } from "react-redux";

import PropTypes from "prop-types";

import CustomCard from "../../../components/CustomCard/index.js";

import RepositoriesTable from './RepositoriesTable.js';

class Repositories extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { repositories } = this.props;
        return (
            <CustomCard
                headerTitle="Repositories"
                headerFactTitle="Count"
                headerFactValue={repositories.length}
            >
                <RepositoriesTable repositories={repositories} />
            </CustomCard>
        );
    }
}

Repositories.propTypes = {
    repositories: PropTypes.array.isRequired,
};

const mapState = state => ({
    repositories: state.milestoneView.repositories,
});

export default connect(mapState, null)(Repositories);
