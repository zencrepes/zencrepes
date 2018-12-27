import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import RepositoriesTable from './RepositoriesTable.js';

import CustomCard from "../../../components/CustomCard/index.js";

class Repositories extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { repositories } = this.props;
        return (
            <CustomCard
                headerTitle="Milestones"
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
    repositories: state.sprintsView.repositories,
});

export default connect(mapState, null)(Repositories);
