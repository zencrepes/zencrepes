import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";


import PropTypes from "prop-types";

import RepositoriesTable from './RepositoriesTable.js';
import AddButton from './AddButton.js';
import AddRepository from './AddRepository/index.js';

import CustomCard from "../../../components/CustomCard/index.js";

const styles = theme => ({
    root: {
    }
});

class Repositories extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, repositories } = this.props;
        return (
            <CustomCard
                headerTitle="Repositores"
                headerFactTitle="Count"
                headerFactValue={repositories.length}
            >
                <RepositoriesTable repositories={repositories} />
                <AddButton />
            </CustomCard>
        );
    }
}

Repositories.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({
    repositories: state.sprintsView.repositories,
});

export default connect(mapState, null)(withStyles(styles)(Repositories));
