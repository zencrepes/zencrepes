import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import PropTypes from "prop-types";

import CustomCard from "../../../components/CustomCard/index.js";

import AssigneesTable from './AssigneesTable.js';
import AddButton from './AddButton.js';

import AddAssignee from './AddAssignee/index.js';

//import { getAssigneesRepartition } from '../../../utils/repartition/index.js';
const styles = theme => ({
    root: {
    }
});

class Assignees extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, assignees } = this.props;
        return (
            <CustomCard
                headerTitle="Assignees"
                headerFactTitle="Count"
                headerFactValue={assignees.length}
            >
                <AddAssignee />
                <AssigneesTable assignees={assignees} />
                <AddButton />
            </CustomCard>
        );
    }
}

Assignees.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    assignees: state.sprintsView.assignees,
});

export default connect(mapState, null)(withStyles(styles)(Assignees));
