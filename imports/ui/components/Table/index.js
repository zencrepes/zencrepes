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

import { cfgIssues } from '../../data/Issues.js';

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
});

const LinkFormatter = ({ value }) => {
    //console.log(value);
    return (
        <Link to={value}>
            <GithubCircle />
        </Link>
    )
}

const LinkTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={LinkFormatter}
        {...props}
    />
);

const DateFormatter = ({ value }) => {
    if (value !== null) {return value.slice(0, 10);}
    else {return '-';}
};

const DateTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={DateFormatter}
        {...props}
    />
);

const LabelsFormatter = ({ value }) => {
    if (value.totalCount > 0) {
        return Array.prototype.map.call(value.edges, s => s.node.name).toString()
    } else {
        return '-';
    }
};

const LabelsTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={LabelsFormatter}
        {...props}
    />
);

const AssigneesFormatter = ({ value }) => {
    if (value.totalCount > 0) {
        return Array.prototype.map.call(value.edges, s => {
            if (s.node.name === null) {
                return s.node.login;
            } else {
                return s.node.name;
            }
        }).toString()
    } else {
        return '-';
    }
};

const AssigneesTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={AssigneesFormatter}
        {...props}
    />
);

class IssuesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'title', title: 'Title' },
                { name: 'org', title: 'Organizartion', getCellValue: row => (row.org ? row.org.name : undefined)},
                { name: 'repo', title: 'Repo', getCellValue: row => (row.repo ? row.repo.name : undefined)},
                { name: 'author', title: 'Author', getCellValue: row => (row.author ? row.author.login : undefined)},
                { name: 'labels', title: 'Labels' },
                { name: 'assignees', title: 'Assignees' },
                { name: 'state', title: 'State' },
                { name: 'points', title: 'Points' },
                { name: 'createdAt', title: 'Created' },
                { name: 'updatedAt', title: 'Updated' },
                { name: 'closedAt', title: 'Closed' },
                { name: 'url', title: '' },
            ],
            tableColumnExtensions: [
                { columnName: 'createdAt', width: 90 },
                { columnName: 'updatedAt', width: 90 },
                { columnName: 'closedAt', width: 90 },
                { columnName: 'state', width: 90 },
                { columnName: 'url', width: 40 },
            ],
            linkColumns: ['url'],
            dateColumns: ['createdAt', 'updatedAt', 'closedAt'],
            labelsColumns: ['labels'],
            assigneesColumns: ['assignees'],
            hiddenColumnNames: ['updatedAt'],
            currentPage: 0,
            pageSize: 50,
            pageSizes: [20, 50, 100],
            selection: [],

        };
        this.changeCurrentPage = currentPage => this.setState({ currentPage });
        this.changePageSize = pageSize => this.setState({ pageSize });
        this.hiddenColumnNamesChange = (hiddenColumnNames) => {
            this.setState({ hiddenColumnNames });
        };

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('Component did update');
        // Updated selection
    }

    changeSelection = async (selection) => {
        const { filtersResults, updateTableSelection } = this.props;
        updateTableSelection(selection);
//        this.setState({ selection });
        await cfgIssues.update({}, { $set: { pinned: false } }, {multi: true});
        selection.forEach((idx) => {
            cfgIssues.update({_id: filtersResults[idx]._id}, {$set: { pinned: true }});
        })
    }

    render() {
        const { classes, issuesLoading, filtersResults, tableSelection } = this.props;
        const { columns, linkColumns, labelsColumns, assigneesColumns, pageSize, pageSizes, currentPage, dateColumns, hiddenColumnNames, tableColumnExtensions} = this.state;

        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardContent>
                        <span>Total rows selected: {tableSelection.length}</span>
                        <Grid
                            rows={filtersResults}
                            columns={columns}
                        >
                            <SelectionState
                                selection={tableSelection}
                                onSelectionChange={this.changeSelection}
                            />
                            <PagingState
                                currentPage={currentPage}
                                onCurrentPageChange={this.changeCurrentPage}
                                pageSize={pageSize}
                                onPageSizeChange={this.changePageSize}
                            />
                            <IntegratedSelection />
                            <IntegratedPaging />
                            <DateTypeProvider
                                for={dateColumns}
                            />
                            <LabelsTypeProvider
                                for={labelsColumns}
                            />
                            <AssigneesTypeProvider
                                for={assigneesColumns}
                            />
                            <LinkTypeProvider
                                for={linkColumns}
                            />
                            <Table columnExtensions={tableColumnExtensions} />
                            <TableHeaderRow />
                            <TableSelection showSelectAll />
                            <TableColumnVisibility
                                hiddenColumnNames={hiddenColumnNames}
                                onHiddenColumnNamesChange={this.hiddenColumnNamesChange}
                            />
                            <Toolbar />
                            <ColumnChooser />
                            <PagingPanel
                                pageSizes={pageSizes}
                            />
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

IssuesTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    updateTableSelection: dispatch.data.updateTableSelection,
});


const mapState = state => ({
    issuesLoading: state.github.issuesLoading,
    filtersResults: state.data.results,
    tableSelection: state.data.tableSelection,
});


export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesTable));
