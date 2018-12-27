import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {
    Grid,
    Table,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';

class AsisgneesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'login', title: 'Username', getCellValue: row => (row.name === null ? row.login : row.name)},
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
        const { classes, assignees } = this.props;
        const { columns, tableColumnExtensions} = this.state;

        return (
            <div className={classes.root}>
                <Grid
                    rows={assignees}
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

AsisgneesTable.propTypes = {
    classes: PropTypes.object.isRequired,
    assignees: PropTypes.array.isRequired,
};


export default AsisgneesTable;
