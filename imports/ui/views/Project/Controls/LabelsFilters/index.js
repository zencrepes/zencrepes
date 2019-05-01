import React, { Component } from 'react';
import PropTypes from "prop-types";

import {connect} from "react-redux";
import Grid from '@material-ui/core/Grid';

import {Label} from '@primer/components';

import { addRemoveFilterOutFromQuery } from '../../../../utils/query/index.js';
import {withRouter} from "react-router-dom";

class LabelsFilters extends Component {
    constructor(props) {
        super(props);
    }

    addRemoveLabel = (label, action) => {
        const { query } = this.props;
        const modifiedQuery = addRemoveFilterOutFromQuery(query, label, action);

        this.props.history.push({
            pathname: '/project',
            search: '?q=' + JSON.stringify(modifiedQuery),
            state: { detail: modifiedQuery }
        });
    };

    render() {
        const { filterLabelsAvailable } = this.props;
        if (filterLabelsAvailable.length > 0) {
            return (
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item >
                        <span>Hide an area:</span>
                    </Grid>
                    <Grid item xs={12} sm container >
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={0}
                        >
                            {filterLabelsAvailable.map((label) => (
                                <Grid item key={label.id} >
                                    <Label size="small" m={1} style={{background: "#" + label.color}} onClick={() => this.addRemoveLabel(label, 'add')}>{label.name}</Label>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            );
        } else {
            return null;
        }
    }
}

LabelsFilters.propTypes = {
    history: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    filterLabelsAvailable: PropTypes.array.isRequired,
    filterLabelsSelected: PropTypes.array.isRequired,
};

const mapState = state => ({
    query: state.projectView.query,
    filterLabelsAvailable: state.projectView.filterLabelsAvailable,
    filterLabelsSelected: state.projectView.filterLabelsSelected,
});

export default withRouter(connect(mapState, null)(LabelsFilters));