import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {
    DataTypeProvider,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';

import RemoveButton from './RemoveButton.js';

const DeleteFormatter = ({ value }) => {
    return <RemoveButton milestone={value} />;
};
DeleteFormatter.propTypes = {
    value: PropTypes.object.isRequired,
};

const DeleteTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={DeleteFormatter}
        {...props}
    />
);

const RepoLinkFormatter = ({ value }) => {
    return <span>{value.name}</span>;
};
RepoLinkFormatter.propTypes = {
    value: PropTypes.object.isRequired,
};

const RepoLinkTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={RepoLinkFormatter}
        {...props}
    />
);

const OrgLinkFormatter = ({ value }) => {
    return <span>{value.login}</span>;
};
OrgLinkFormatter.propTypes = {
    value: PropTypes.object.isRequired,
};

const OrgLinkTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={OrgLinkFormatter}
        {...props}
    />
);

const MilestoneLinkFormatter = ({ value }) => {
    return <span>{value.state}</span>;
};
MilestoneLinkFormatter.propTypes = {
    value: PropTypes.object.isRequired,
};

const MilestoneLinkTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={MilestoneLinkFormatter}
        {...props}
    />
);

class RepositoriesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'orglogin', title: 'Org', getCellValue: row => (row.org) },
                { name: 'name', title: 'Repo', getCellValue: row => (row.repo) },
                { name: 'state', title: 'State', getCellValue: row => row},
                { name: 'issues', title: 'Issues', getCellValue: row => (row.issues ? row.issues.count : undefined)},
                { name: 'points', title: 'Points', getCellValue: row => (row.issues ? row.points.count : undefined)},
                { name: 'delete', title: 'Del', getCellValue: row => row},
            ],
            tableColumnExtensions: [
                { columnName: 'state', width: 55 },
                { columnName: 'issues', width: 55, align: 'right' },
                { columnName: 'points', width: 55, align: 'right' },
                { columnName: 'delete', width: 60 },
            ],
            deleteColumns: ['delete'],
            repoLinkColumns: ['name'],
            orgLinkColumns: ['orglogin'],
            milestoneLinkColumns: ['state'],
        };
    }

    render() {
        const { repositories } = this.props;
        const { columns, tableColumnExtensions, deleteColumns, repoLinkColumns, orgLinkColumns, milestoneLinkColumns} = this.state;

        return (
            <Grid
                rows={repositories}
                columns={columns}
            >
                <DeleteTypeProvider
                    for={deleteColumns}
                />
                <RepoLinkTypeProvider
                    for={repoLinkColumns}
                />
                <OrgLinkTypeProvider
                    for={orgLinkColumns}
                />
                <MilestoneLinkTypeProvider
                    for={milestoneLinkColumns}
                />
                <Table columnExtensions={tableColumnExtensions} />
                <TableHeaderRow />
            </Grid>
        );
    }
}

RepositoriesTable.propTypes = {
    repositories: PropTypes.array.isRequired,
};

export default RepositoriesTable;
