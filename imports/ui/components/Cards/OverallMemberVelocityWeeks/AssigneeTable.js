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
import Button from '@material-ui/core/Button';

import { GithubCircle } from 'mdi-material-ui'

import Highcharts from 'highcharts/highcharts';
import {
    HighchartsSparkline, Chart, withHighcharts, XAxis, YAxis, Title, Legend,
    AreaSplineSeries, SplineSeries, Series, AreaSeries, Navigator, RangeSelector, Tooltip
} from 'react-jsx-highstock';

import tableStyle from './tableStyle.jsx';


const DateFormatter = (value) => {
    if (value !== null) {return value.slice(0, 10);}
    else {return '-';}
};

const openGitHub = (githubLink) => {
    window.open(githubLink, '_blank');
};

const getTimeToCompletion = (assignee) => {
    let velocity = _.find(assignee.velocity, {'range': assignee.defaultVelocity});
    if (velocity !== undefined) {
        return velocity.issues.effort;
    } else {
        return '-';
    }
};
const getTicketsPerWeek = (assignee) => {
    let velocity = _.find(assignee.velocity, {'range': assignee.defaultVelocity});
    if (velocity !== undefined) {
        return Math.round(velocity.issues.velocity, 1);
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
        const { filter, updateFromQuery } = this.props;

        let updatedQuery = {...filter, ...{
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

    massageDataForHighchart(data) {
        let dataset = [];
        data.forEach((v) => {
            dataset.push([new Date(v.weekStart).getTime(), Math.round(v.issues.velocity, 1)]);
        });
        return dataset
    }

    renderChart (count, assignee) {
        if (assignee.weeks.length > 0) {
            let dataset = this.getDataSet(assignee.weeks, count);
            return (
                <HighchartsSparkline>
                    <AreaSeries data={this.massageDataForHighchart(dataset)} />
                </HighchartsSparkline>
            );
        } else {
            return '-';
        }
    }

/*
 https://whawker.github.io/react-jsx-highcharts/examples/Sparkline/index.html

 <HighchartsSparkline
 series={
 <AreaSeries name="Tickets/week: " data={this.massageDataForHighchart(dataset)} color="#C12127" />
 }>
 <Tooltip
 useHTML
 borderWidth={1}
 shadow={false}
 hideDelay={0}
 padding={8}
 headerFormat={`<b>${name}:</b> `}
 pointFormat={'{point.y:,.0f}'}
 positioner={positioner} />
 </HighchartsSparkline>


     */

    render() {
        const { classes, tableHeaderColor, tableData } = this.props;

        console.log(tableData);
        let dataset = tableData.filter(v => v.login !== 'UNASSIGNED');
        dataset = tableData.filter(v => v.weeks !== undefined);
        if (tableData.length > 0) {
            return (
                <div className={classes.tableResponsive}>
                    <Table className={classes.table}>
                        <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
                            <TableRow key={0}>
                                <TableCell className={classes.tableCell} key={1}>Assignee</TableCell>
                                <TableCell className={classes.tableCell} key={2}>Last 8 Weeks</TableCell>
                                <TableCell className={classes.tableCell} key={3}>Last 6 Months</TableCell>
                                <TableCell className={classes.tableCell} key={4}>Open tickets</TableCell>
                                <TableCell className={classes.tableCell} key={5}>Tickets/week</TableCell>
                                <TableCell className={classes.tableCell} key={6}>Time to Completion</TableCell>
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
                                        <TableCell className={classes.tableCell} key={6}>
                                            {getTicketsPerWeek(assignee)}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} key={5}>
                                            <Button variant="raised" size="small" color="primary" onClick={() => this.clickAssignee(assignee.login)}>
                                                {getTimeToCompletion(assignee)} days
                                            </Button>
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
    filter: state.repartition.filter,
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

