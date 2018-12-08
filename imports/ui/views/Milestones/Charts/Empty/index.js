import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';

import CustomCard from "../../../../components/CustomCard/index.js";
import {withRouter} from "react-router-dom";

import CloseEmptyButton from './CloseEmptyButton.js';

const styles = theme => ({
    root: {
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
});


class Empty extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, milestones } = this.props;
        return (
            <CustomCard
                headerTitle="Closed but Empty"
                headerFactTitle="Count"
                headerFactValue={milestones.filter(m => m.state.toLowerCase() === 'closed').filter(milestone => milestone.issues.totalCount === 0).length}
            >
                <CloseEmptyButton />
            </CustomCard>
        );
    }
}

Empty.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    milestones: state.milestonesView.milestones,
});

export default withRouter(connect(mapState, null)(withStyles(styles)(Empty)));