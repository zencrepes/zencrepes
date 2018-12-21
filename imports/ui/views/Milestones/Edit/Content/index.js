import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from 'react-moment';
import ReactMarkdown from 'react-markdown';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import CustomCard from "../../../../components/CustomCard/index.js";

import MilestoneDescription from './MilestoneDescription.js';
import MilestoneDueDate from './MilestoneDueDate.js';
import MilestoneTitle from './MilestoneTitle.js';

const styles = theme => ({
    root: {
        width: '100%',
    }
});

class Content extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            classes,
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
    classes: PropTypes.object,
};

const mapState = state => ({
    selectedMilestoneTitle: state.milestonesEdit.selectedMilestoneTitle,
    selectedMilestoneDueDate: state.milestonesEdit.selectedMilestoneDueDate,
});

const mapDispatch = dispatch => ({
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Content));
