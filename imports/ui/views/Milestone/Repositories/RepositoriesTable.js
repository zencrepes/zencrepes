import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {
    Grid,
    Table,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';

class RepositoriesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'org', title: 'Org', getCellValue: row => row.org.login},
                { name: 'name', title: 'Repo'},
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
        const { repositories } = this.props;
        const { columns, tableColumnExtensions} = this.state;

        return (
            <React.Fragment>
                <Grid
                    rows={repositories}
                    columns={columns}
                >
                    <Table columnExtensions={tableColumnExtensions} />
                    <TableHeaderRow />
                </Grid>
            </React.Fragment>
        );
    }
}

RepositoriesTable.propTypes = {
    repositories: PropTypes.array.isRequired,
};


export default RepositoriesTable;
