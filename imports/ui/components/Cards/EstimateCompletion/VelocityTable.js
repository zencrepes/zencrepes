import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { connect } from "react-redux";
import { GithubCircle } from 'mdi-material-ui'
import { Link } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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

let id = 0;
function createData(period, daily, days) {
    id += 1;
    return { id, period, daily, days };
}

const data = [
    createData('All time', 4.9, 100),
    createData('4 weeks', 20.2, 24),
    createData('8 weeks', 24.6, 20),
    createData('12 weeks', 31, 16),
];

class VelocityTable extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const { classes, velocityData } = this.props;
        const { columns, pageSize, pageSizes, currentPage, editingStateColumnExtensions } = this.state;

        /*
         0: {range: "all", velocityClosedCount: 4.955882352941177, velocityClosedPoints: 0, effortCountDays: 100}
         1: {range: "4w", velocityClosedCount: 20.25, velocityClosedPoints: 0, effortCountDays: 24}
         2: {range: "8w", velocityClosedCount: 24.625, velocityClosedPoints: 0, effortCountDays: 20}
         3: {range: "12w", velocityClosedCount: 31.583333333333332, velocityClosedPoints: 0, effortCountDays: 16}
         length: 4__proto__: Array(0)
         */

        return (
            <div className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow className={classes.row}>
                            <TableCell>Period</TableCell>
                            <TableCell numeric>Weekly Velocity</TableCell>
                            <TableCell numeric>Days to Completion</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {velocityData.map(n => {
                            return (
                                <TableRow key={n.range} className={classes.row}>
                                    <TableCell component="th" scope="row">{n.range}</TableCell>
                                    <TableCell numeric>{Math.round(n.velocityClosedCount, 1)}</TableCell>
                                    <TableCell numeric>{Math.round(n.effortCountDays, 1)}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                <i>Calculates velocity over the selected period.</i>
            </div>
        );
    }
}

VelocityTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});


const mapState = state => ({
    velocityData: state.velocity.velocity,

});


export default
    connect(mapState, mapDispatch)
    (
        withTracker(() => {return {queriesList: cfgQueries.find({}).fetch()}})
        (
            withStyles(styles)(VelocityTable)
        )
    );


//export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesTable));
