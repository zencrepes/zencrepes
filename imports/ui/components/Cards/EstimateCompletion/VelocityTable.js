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
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
});

let id = 0;
function createData(name, calories, fat, carbs, protein) {
    id += 1;
    return { id, name, calories, fat, carbs, protein };
}

const data = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

class VelocityTable extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const { classes, queriesList } = this.props;
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
                        <TableRow>
                            <TableCell>Period</TableCell>
                            <TableCell numeric>Daily Velocity</TableCell>
                            <TableCell numeric>Days to Completion</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map(n => {
                            return (
                                <TableRow key={n.id}>
                                    <TableCell component="th" scope="row">
                                        {n.name}
                                    </TableCell>
                                    <TableCell numeric>{n.calories}</TableCell>
                                    <TableCell numeric>{n.fat}</TableCell>
                                    <TableCell numeric>{n.carbs}</TableCell>
                                    <TableCell numeric>{n.protein}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
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
