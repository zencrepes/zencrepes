import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';
import {withRouter} from "react-router-dom";
import {Label} from "@primer/components";
import fontColorContrast from 'font-color-contrast';

import { addRemoveFilterOutFromQuery } from "../../../utils/query/index.js";

import IconButton from '@material-ui/core/IconButton';
import WarningIcon from '@material-ui/icons/Warning';

import Clear from './Clear.js';
import MongoFilter from './MongoFilter.js';

const styles = theme => ({
    root: {
        margin: '10px',
        border: `1px solid ${theme.palette.divider}`,
    },
    labels: {
        margin: '10px',    },
    query: {
        flex: 1,
    },
});

class LabelsExclude extends Component {
    constructor (props) {
        super(props);
    }

    addRemoveLabel = (label, action) => {
        const { query } = this.props;
        const modifiedQuery = addRemoveFilterOutFromQuery(query, label, action);
//        console.log('Label: ' + label.name + ' - Action: ' + action);
//        console.log('From query: ' + JSON.stringify(query));
//        console.log('To query: ' + JSON.stringify(modifiedQuery));

        this.props.history.push({
            pathname: '/project',
            search: '?q=' + encodeURIComponent(JSON.stringify(modifiedQuery)),
            state: { detail: modifiedQuery }
        });
    };

    clearFilters = () => {
        const { filterLabelsSelected, query } = this.props;
        let modifiedQuery = {...query};
        filterLabelsSelected.forEach((label) => {
            modifiedQuery = addRemoveFilterOutFromQuery(modifiedQuery, label, 'remove');
        });
//        console.log('From query: ' + JSON.stringify(query));
//        console.log('To query: ' + JSON.stringify(modifiedQuery));

        this.props.history.push({
            pathname: '/project',
            search: '?q=' + encodeURIComponent(JSON.stringify(modifiedQuery)),
            state: { detail: modifiedQuery }
        });
    };

    render() {
        const { classes, filterLabelsSelected, query } = this.props;
        if (filterLabelsSelected.length > 0) {
            return (
                <div className={classes.root}>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        <Grid item >
                            <IconButton aria-label="Warning" disabled={true}>
                                <WarningIcon />
                            </IconButton>
                            <span>Excluded from query: </span>
                        </Grid>
                        <Grid item xs={12} sm container>
                            <div className={classes.labels}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    spacing={8}
                                >
                                    {filterLabelsSelected.map((label) => (
                                        <Grid item key={label.id} >
                                            <Label size="large" m={1} style={{background: "#" + label.color, color: fontColorContrast("#" + label.color)}} onClick={() => this.addRemoveLabel(label, 'remove')}>{label.name}</Label>
                                        </Grid>
                                    ))}
                                </Grid>
                            </div>
                        </Grid>
                        <Grid item >
                            <Grid
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                                spacing={0}
                            >
                                <Grid item >
                                    <Clear onClick={() => this.clearFilters()}/>
                                </Grid>
                                <Grid item >
                                    <MongoFilter query={query}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            );
        } else {
            return null;
        }

    }
}

LabelsExclude.propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    filterLabelsSelected: PropTypes.array.isRequired,
};

const mapState = state => ({
    query: state.projectView.query,
    filterLabelsSelected: state.projectView.filterLabelsSelected,
});

export default withRouter(connect(mapState, null)(withStyles(styles)(LabelsExclude)));

