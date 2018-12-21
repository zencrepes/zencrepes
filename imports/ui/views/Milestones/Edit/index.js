import _ from 'lodash';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter, Link } from 'react-router-dom';
import PropTypes from "prop-types";

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import styles from '../../../styles.jsx';

import General from '../../../layouts/General/index.js';

//import CustomCard from "../../../../components/CustomCard/index.js";

import Content from './Content/index.js';
import Repositories from './Repositories/index.js';

class MilestoneEdit extends Component {
    constructor(props) {
        super(props);
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    componentDidMount() {
        const { updateQuery } = this.props;
        const params = new URLSearchParams(this.props.location.search);
        const queryUrl = params.get('q');
        if (queryUrl === null) {
            updateQuery({});
        } else {
            updateQuery(JSON.parse(queryUrl));
        }
    };

    render() {
        const {
            classes,
            selectedMilestoneDueDate,
            selectedMilestoneTitle,
        } = this.props;

        var moment = require('moment');
        const dueDate = moment(selectedMilestoneDueDate).utc().format('ddd MMM D, YYYY');

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
                        <Grid item xs={12} sm={6} md={7}>
                            <Content />
                        </Grid>
                        <Grid item xs={12} sm={6} md={5}>
                            <Repositories />
                        </Grid>
                    </Grid>

                </General>
            </div>
        );
    }
}

MilestoneEdit.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    selectedMilestoneTitle: state.milestonesEdit.selectedMilestoneTitle,
    selectedMilestoneDueDate: state.milestonesEdit.selectedMilestoneDueDate,
});

const mapDispatch = dispatch => ({
    updateQuery: dispatch.milestonesEdit.updateQuery,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(MilestoneEdit));
