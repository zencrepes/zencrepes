import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import CustomCard from "../../../../components/CustomCard/index.js";

import MilestoneDescription from './MilestoneDescription.js';
import MilestoneDueDate from './MilestoneDueDate.js';
import MilestoneTitle from './MilestoneTitle.js';

class Content extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            selectedMilestoneDueDate,
            selectedMilestoneTitle,
        } = this.props;

        var moment = require('moment');
        const dueDate = moment(selectedMilestoneDueDate).utc().format('ddd MMM D, YYYY');

        return (
            <CustomCard
                headerTitle={selectedMilestoneTitle}
                headerFactTitle="Due date"
                headerFactValue={dueDate}
            >
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={12} sm container>
                        <MilestoneTitle />
                    </Grid>
                    <Grid item >
                        <MilestoneDueDate />
                    </Grid>
                </Grid>
                <MilestoneDescription />
            </CustomCard>
        );
    }
}

Content.propTypes = {
    selectedMilestoneTitle: PropTypes.string.isRequired,
    selectedMilestoneDueDate: PropTypes.string.isRequired,
};

const mapState = state => ({
    selectedMilestoneTitle: state.milestonesEdit.selectedMilestoneTitle,
    selectedMilestoneDueDate: state.milestonesEdit.selectedMilestoneDueDate,
});

export default connect(mapState, null)(Content);
