import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";


import PropTypes from "prop-types";

import RepositoriesTable from './RepositoriesTable.js';

import CustomCard from "../../../../components/CustomCard/index.js";

const styles = theme => ({
    root: {
    }
});

class Repositories extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, milestones, allMilestones } = this.props;
        return (
            <CustomCard
                headerTitle="Repositories"
                headerFactTitle="Count"
                headerFactValue={milestones.length}
            >
                <RepositoriesTable repositories={milestones} />
                {allMilestones.length > milestones.length &&
                    <span>This milestone is also present in {allMilestones.length - milestones.length} other repositories</span>
                }
            </CustomCard>
        );
    }
}

Repositories.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({
    milestones: state.milestonesEdit.milestones,
    allMilestones: state.milestonesEdit.allMilestones,
});

export default connect(mapState, null)(withStyles(styles)(Repositories));
