import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {
    Grid,
    Table,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';

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
        const { labels } = this.props;
        const { columns, tableColumnExtensions} = this.state;

        return (
            <React.Fragment>
                <Grid
                    rows={labels}
                    columns={columns}
                >
                    <Table columnExtensions={tableColumnExtensions} />
                    <TableHeaderRow />
                </Grid>
                <i>*Issues with multiple labels are counted multiple times</i>
            </React.Fragment>
        );
    }
}

LabelsTable.propTypes = {
    labels: PropTypes.array.isRequired,
};

export default LabelsTable;
