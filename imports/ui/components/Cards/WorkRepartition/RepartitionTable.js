import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import {
    withRouter
} from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { connect } from "react-redux";
import { GithubCircle } from 'mdi-material-ui'
import { Link } from 'react-router-dom';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';

import { cfgQueries } from '../../../data/Queries.js';

const styles = theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        //width: 700,
    },
    row: {
        height: 24,
    },
});

const velocityDailyFormatter = (params) => {
    if (params.value === undefined) {
        return '-';
    } else {
        var value = params.value.find(function(element) {
            return element.range === '8w';
        });
        if (value === undefined) {
            value = params.value.find(function(element) {
                return element.range === 'all';
            });
        }
        return Math.round(value['velocityClosedCount'], 1);
    }
}

const velocityRemainingFormatter = (params) => {
    if (params.value === undefined) {
        return '-';
    } else {
        var value = params.value.find(function(element) {
            return element.range === '8w';
        });
        if (value === undefined) {
            value = params.value.find(function(element) {
                return element.range === 'all';
            });
        }
        return value['effortCountDays'];
    }
}


class RepartitionTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                {headerName: "Assignee", field: "login", width: 150, onCellClicked: this.clickAssignee},
                {headerName: "Open Issues", field: "count", width: 70},
                {headerName: "Per Day", field: "velocity", valueFormatter: velocityDailyFormatter, width: 70},
                {headerName: "Days To Completion", field: "velocity", valueFormatter: velocityRemainingFormatter, width: 70},
            ],
        };
    }

    /* clickAssignee() - If a table cell is clicked, redirect the user to the search page with the parameters allowing to see the open issues
     *
     */
    clickAssignee = (params) => {
        const { mongoFilter, updateFromQuery } = this.props;
        console.log(params);
        let updatedQuery = {...mongoFilter, ...{'state':{$in:['OPEN']},'assignees.totalCount':{$eq:0}}};
        if (params.value !== 'UNASSIGNED') {
            updatedQuery = {...mongoFilter, ...{'state':{$in:['OPEN']},'assignees.edges':{$elemMatch:{'node.login':{$in:[params.value]}}}}};
        }
        updateFromQuery(updatedQuery, this.props.history);
        //console.log(this.props);
        //this.props.history.push('/search');
    };


    render() {
        const { classes, repartition, loading } = this.props;
        const { columns, columnDefs, pageSizes, currentPage, editingStateColumnExtensions } = this.state;

        if (!loading) {
            console.log(repartition);
            return (
                <div className="ag-theme-balham"
                     style={{
                         height: '180px',
                         width: '100%' }}
                >
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={repartition}>
                    </AgGridReact>
                    <i>Break down tasks per assignee with estimated days to completion</i>
                </div>
            );
        } else {
            return null;
        }

    }
}

RepartitionTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    updateFromQuery: dispatch.data.updateFromQuery,
});


const mapState = state => ({
    repartition: state.repartition.repartition,
    loading: state.repartition.loading,
    mongoFilter: state.repartition.mongoFilter,
});


export default
    connect(mapState, mapDispatch)
    (
        withTracker(() => {return {queriesList: cfgQueries.find({}).fetch()}})
        (
            withRouter
            (
                withStyles(styles)(RepartitionTable)
            )
        )
    );

