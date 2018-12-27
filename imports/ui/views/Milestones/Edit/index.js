import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import General from '../../../layouts/General/index.js';

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
    }

    render() {
        //var moment = require('moment');
        //const dueDate = moment(selectedMilestoneDueDate).utc().format('ddd MMM D, YYYY');

        return (
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
        );
    }
}

MilestoneEdit.propTypes = {
    selectedMilestoneTitle: PropTypes.string.isRequired,
    selectedMilestoneDueDate: PropTypes.string.isRequired,
    updateQuery: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
};

const mapState = state => ({
    selectedMilestoneTitle: state.milestonesEdit.selectedMilestoneTitle,
    selectedMilestoneDueDate: state.milestonesEdit.selectedMilestoneDueDate,
});

const mapDispatch = dispatch => ({
    updateQuery: dispatch.milestonesEdit.updateQuery,
});

export default connect(mapState, mapDispatch)(MilestoneEdit);
