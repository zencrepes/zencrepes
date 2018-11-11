import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { connect } from "react-redux";
import { GithubCircle } from 'mdi-material-ui'
import { Link } from 'react-router-dom';

import {
    // State or Local Processing Plugins
    SelectionState,
    PagingState,
    IntegratedSelection,
    IntegratedPaging,
    DataTypeProvider,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
    ColumnChooser,
    TableColumnVisibility,
    TableSelection,
    Toolbar,
} from '@devexpress/dx-react-grid-material-ui';

const styles = theme => ({
    root: {
    },
});

class LabelsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'name', title: 'Label'},
                { name: 'issues', title: 'Issues*', getCellValue: row => (row.issues ? row.issues.count : undefined)},
                { name: 'points', title: 'Points*', getCellValue: row => (row.issues ? row.points.count : undefined)},
            ],
            tableColumnExtensions: [
                { columnName: 'issues', width: 80 },
                { columnName: 'points', width: 80 },
            ]
        };
    }

    render() {
        const { classes, labels } = this.props;
        const { columns, tableColumnExtensions} = this.state;

        return (
            <div className={classes.root}>
                <Grid
                    rows={labels}
                    columns={columns}
                >
                    <Table columnExtensions={tableColumnExtensions} />
                    <TableHeaderRow />
                </Grid>
                <i>*Issues with multiple assignees are counted multiple times</i>
            </div>
        );
    }
}

LabelsTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});


const mapState = state => ({

});


export default connect(mapState, mapDispatch)(withStyles(styles)(LabelsTable));
