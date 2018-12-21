import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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

import RemoveButton from './RemoveButton.js';

const styles = theme => ({
    root: {
    },
});

const DeleteFormatter = ({ value }) => {
    return <RemoveButton milestone={value} />;
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

const RepoLinkTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={RepoLinkFormatter}
        {...props}
    />
);

const OrgLinkFormatter = ({ value }) => {
    return <span>{value.login}</span>;
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
                { name: 'issues', title: 'Issues', getCellValue: row => (row.issues ? row.issues.totalCount : undefined)},
                { name: 'delete', title: 'Del', getCellValue: row => row},
            ],
            tableColumnExtensions: [
                { columnName: 'state', width: 60 },
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
        const { classes, repositories } = this.props;
        const { columns, tableColumnExtensions, deleteColumns, repoLinkColumns, orgLinkColumns, milestoneLinkColumns} = this.state;

        return (
            <div className={classes.root}>
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
            </div>
        );
    }
}

RepositoriesTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});

const mapState = state => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(RepositoriesTable));
