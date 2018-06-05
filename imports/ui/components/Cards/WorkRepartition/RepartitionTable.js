import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

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
    console.log(params);
    if (params.value === undefined) {
        return '-';
    } else {
        var value = params.value.find(function(element) {
            return element.range === '8w';
        });
        return Math.round(value['velocityClosedCount'], 1);
    }
}

const velocityRemainingFormatter = (params) => {
    console.log(params);
    if (params.value === undefined) {
        return '-';
    } else {
        var value = params.value.find(function(element) {
            return element.range === '8w';
        });
        return value['effortCountDays'];
    }
}

class RepartitionTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                {headerName: "Assignee", field: "login"},
                {headerName: "Open Issues", field: "count"},
                {headerName: "Per Day", field: "velocity", valueFormatter: velocityDailyFormatter},
                {headerName: "Days To Completion", field: "velocity", valueFormatter: velocityRemainingFormatter},
            ],
        };
    }

    render() {
        const { classes, repartition, loading } = this.props;
        const { columns, columnDefs, pageSizes, currentPage, editingStateColumnExtensions } = this.state;

        if (!loading) {
            console.log(repartition);
            return (
                <div className="ag-theme-balham"
                     style={{
                         height: '500px',
                         width: '100%' }}
                >
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={repartition}>
                    </AgGridReact>
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

});


const mapState = state => ({
    repartition: state.repartition.repartition,
    loading: state.repartition.loading,

});


export default
    connect(mapState, mapDispatch)
    (
        withTracker(() => {return {queriesList: cfgQueries.find({}).fetch()}})
        (
            withStyles(styles)(RepartitionTable)
        )
    );

