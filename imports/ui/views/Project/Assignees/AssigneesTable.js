import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {
    Grid,
    Table,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';

import { RunFast } from 'mdi-material-ui';
import {DataTypeProvider} from "@devexpress/dx-react-grid";
import Tooltip from '@material-ui/core/Tooltip';

const CoreFormatter = ({ value }) => {
    if (value.core === true) {
        return <Tooltip title="Member of the project team"><RunFast /></Tooltip>;
    } else {
        return null;
    }
};
CoreFormatter.propTypes = {
    value: PropTypes.object,
};

const CoreTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={CoreFormatter}
        {...props}
    />
);

class AssigneesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'core', title: 'Team',  getCellValue: row => (row)},
                { name: 'login', title: 'Username', getCellValue: row => ((row.name === null || row.name === '') ? row.login : row.name)},
                { name: 'issues', title: 'Issues*', getCellValue: row => (row.issues ? row.issues.count : undefined)},
                { name: 'points', title: 'Points*', getCellValue: row => (row.issues ? row.points.count : undefined)},
            ],
            tableColumnExtensions: [
                { columnName: 'core', width: 70 },
                { columnName: 'issues', width: 80 },
                { columnName: 'points', width: 80 },
            ],
            coreColumns: ['core'],
        };
    }

    render() {
        const { assignees } = this.props;
        const { columns, tableColumnExtensions, coreColumns} = this.state;

        return (
            <React.Fragment>
                <Grid
                    rows={assignees}
                    columns={columns}
                >
                    <Table columnExtensions={tableColumnExtensions} />
                    <TableHeaderRow />
                    <CoreTypeProvider
                        for={coreColumns}
                    />
                </Grid>
                <i>*Issues with multiple assignees are counted multiple times</i>
            </React.Fragment>
        );
    }
}

AssigneesTable.propTypes = {
    assignees: PropTypes.array.isRequired,
};


export default AssigneesTable;
