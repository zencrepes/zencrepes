import React, { Component } from 'react';
import _ from 'lodash';

import {
    withRouter
} from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';

import { TableLarge } from 'mdi-material-ui';

import Button from '@material-ui/core/Button';

import { GithubCircle } from 'mdi-material-ui'

import Highcharts from 'highcharts/highcharts';
import {
    HighchartsSparkline, Chart, withHighcharts, XAxis, YAxis, Title, Legend,
    AreaSplineSeries, SplineSeries, Series, AreaSeries, Navigator, RangeSelector, Tooltip
} from 'react-jsx-highstock';

//import tableStyle from './tableStyle.jsx';
import tableStyle from '../../../assets/jss/material-dashboard-react/components/tableStyle.jsx';

const getTimeToCompletion = (assignee, type) => {
    let velocity = _.find(assignee.velocity, {'range': assignee.defaultVelocity});
    if (velocity !== undefined && velocity[type].effort > 0) {
        return velocity[type].effort + ' days';
    } else {
        return '-';
    }
};
const getTicketsPerWeek = (assignee, type) => {
    let velocity = _.find(assignee.velocity, {'range': assignee.defaultVelocity});
    if (velocity !== undefined) {
        return Math.round(velocity[type].velocity, 1);
    } else {
        return '-';
    }
};


class AssigneeTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }


    /* clickAssignee() - If a table cell is clicked, redirect the user to the search page with the parameters allowing to see the open issues
     *
     */
    clickAssignee = (login) => {
        const { filters, updateFromQuery } = this.props;

        console.log(filters);

        let updatedQuery = {...filters, ...{
            state: {
                header: 'States',
                group: 'state',
                type: 'text',
                nested: false,
                in: ['OPEN'],
                nullSelected: false
            }
            ,
            assignees: {
                header: 'Assignees',
                group: 'assignees',
                type: 'text',
                nested: 'login',
                nullName: 'UNASSIGNED',
                nullFilter: {'assignees.totalCount': {'$eq': 0}},
                in: [login],
                nullSelected: false
            }
        }};
        updateFromQuery(updatedQuery, this.props.history);

    };

    getDataSet(data, period) {
        let startPos = 0;
        let endPos = data.length;
        if (data.length > period) {
            startPos = data.length - period;
        }
        return data.slice(startPos, endPos);
    }

    massageDataForHighchart(data, type) {
        let dataset = [];
        data.forEach((v) => {
            dataset.push([new Date(v.weekStart).getTime(), Math.round(v[type].velocity, 1)]);
        });
        return dataset
    }

    renderChart (count, assignee) {
        if (assignee.weeks.length > 0) {
            let dataset = this.getDataSet(assignee.weeks, count);
            return (
                <HighchartsSparkline>
                    <AreaSeries data={this.massageDataForHighchart(dataset, 'issues')} />
                    <AreaSeries data={this.massageDataForHighchart(dataset, 'points')} />
                </HighchartsSparkline>
            );
        } else {
            return '-';
        }
    }

    buildReferenceDataset(dataset) {
        console.log(dataset);
        if (dataset.length > 0) {
            let emptyDataset = [];
            //Build an empty dataset containing all weeks from the overall set
            console.log(dataset);
            dataset.forEach((assignee) => {
                assignee.weeks.forEach((week) => {
                    if(!_.find(emptyDataset, {weekStart: week.weekStart})) {
                        emptyDataset.push({
                            weekStart: week.weekStart,
                            issues: {count: 0, velocity:0},
                            points: {count: 0, velocity:0}
                        });
                    }
                });
            });
            emptyDataset = _.sortBy(emptyDataset, 'weekStart');

            console.log(emptyDataset);

            dataset.forEach((assignee) => {
                let assigneeData = [];
                emptyDataset.forEach((week) => {
                    let currentValue = _.find(assignee.weeks, {weekStart: week.weekStart});
                    if(!currentValue) {
                        assigneeData.push(week);
                    } else {
                        assigneeData.push(currentValue);
                    }
                });
                assigneeData = _.sortBy(assigneeData, 'weekStart');
                assignee.weeks = assigneeData;
            });
        }
        return dataset;
    }

    render() {
        const { classes, repartition } = this.props;
        let dataset = repartition.filter(v => v.login !== 'UNASSIGNED');
        dataset = dataset.filter(v => v.weeks !== undefined);
        dataset = this.buildReferenceDataset(dataset);
        console.log(dataset);
        if (dataset.length > 0) {
            return (
                <div className={classes.tableResponsive}>
                    <Table className={classes.table}>
                        <TableHead className={classes["TableHeader"]}>
                            <TableRow key={0}>
                                <TableCell className={classes.tableCell} key={1}>Assignee</TableCell>
                                <TableCell className={classes.tableCell} key={2}>Last 8 Weeks</TableCell>
                                <TableCell className={classes.tableCell} key={3}>Last 6 Months</TableCell>
                                <TableCell className={classes.tableCell} key={4}>Open tickets</TableCell>
                                <TableCell className={classes.tableCell} key={5}>Tickets/week</TableCell>
                                <TableCell className={classes.tableCell} key={6}>Time to Completion</TableCell>
                                <TableCell className={classes.tableCell} key={7}>Open Points</TableCell>
                                <TableCell className={classes.tableCell} key={8}>Points/week</TableCell>
                                <TableCell className={classes.tableCell} key={9}>Time to Completion</TableCell>
                                <TableCell className={classes.tableCell} key={10}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataset.map((assignee, key) => {
                                return (
                                    <TableRow key={assignee.login}>
                                        <TableCell className={classes.tableCell} key={1}>
                                            {assignee.login}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} key={2}>
                                            {this.renderChart(12, assignee)}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} key={3}>
                                            {this.renderChart(36, assignee)}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} key={4}>
                                            {assignee.open.issues.length}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} key={5}>
                                            {getTicketsPerWeek(assignee, 'issues')}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} key={6}>
                                            {getTimeToCompletion(assignee, 'issues')}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} key={7}>
                                            {assignee.open.points}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} key={8}>
                                            {getTicketsPerWeek(assignee, 'points')}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} key={9}>
                                            {getTimeToCompletion(assignee, 'points')}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} key={10}>
                                            <IconButton color="secondary" className={classes.button} aria-label="Open in search" onClick={() => this.clickAssignee(assignee.login)}>
                                                <TableLarge />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            );
        } else {
            return null;
        }

    }
}

AssigneeTable.propTypes = {
    classes: PropTypes.object.isRequired,
};


const mapDispatch = dispatch => ({
    updateFromQuery: dispatch.data.updateFromQuery,
});

const mapState = state => ({
    repartition: state.repartition.repartition,
    filters: state.repartition.filters,
});

export default
    connect(mapState, mapDispatch)
    (
        withRouter
        (
            withStyles(tableStyle)(
                withHighcharts(AssigneeTable, Highcharts)
            )
        )
    );

