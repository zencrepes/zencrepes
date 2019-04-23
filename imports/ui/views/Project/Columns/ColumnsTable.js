import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {
    Grid,
    Table,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';

class ColumnsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnsConfig: [
                { name: 'name', title: 'Column'},
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
        const { columns } = this.props;
        const { columnsConfig, tableColumnExtensions} = this.state;

        return (
            <React.Fragment>
                <Grid
                    rows={columns}
                    columns={columnsConfig}
                >
                    <Table columnExtensions={tableColumnExtensions} />
                    <TableHeaderRow />
                </Grid>
            </React.Fragment>
        );
    }
}

ColumnsTable.propTypes = {
    columns: PropTypes.array.isRequired,
};

export default ColumnsTable;
