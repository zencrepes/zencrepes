import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import styles from '../../styles.jsx';

import General from '../../layouts/General/index.js';

import MilestonesFetch from '../../data/Milestones/Fetch/index.js';
import MilestonesEdit from '../../data/Milestones/Edit/index.js';

import MilestonesTable from './MilestonesTable.js';
import LoadButton from './LoadButton.js';
import DeleteClosedEmptyButton from './DeleteClosedEmptyButton.js';

class Milestones extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { updateMilestones } = this.props;
        updateMilestones();
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <General>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        <Grid item xs={12} sm={12} md={4}>
                            <h3>TODO: Chart to display a breakdown of open/closed milestones</h3>
                            <LoadButton />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <h3>TODO: Chart & Button to show Milestones with a mixed closed/open</h3>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <h3>TODO: Chart & Button to show closed milestones with 0 issues</h3>
                            <DeleteClosedEmptyButton />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <MilestonesEdit loadModal={true} />
                            <MilestonesFetch loadModal={false} />
                            <MilestonesTable />
                        </Grid>
                    </Grid>
                </General>
            </div>
        );
    }
}

Milestones.propTypes = {
    classes: PropTypes.object,
};

const mapDispatch = dispatch => ({
    updateMilestones: dispatch.milestonesView.updateMilestones,

});

export default connect(null, mapDispatch)(withRouter(withStyles(styles)(Milestones)));
