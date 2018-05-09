import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { connect } from "react-redux";
import { GithubCircle } from 'mdi-material-ui'
import { Link } from 'react-router-dom';

import {
    // State or Local Processing Plugins
    PagingState,
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

class IssuesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'title', title: 'Title' },
                { name: 'createdAt', title: 'Created' },
                { name: 'updatedAt', title: 'Updated' },
                { name: 'closedAt', title: 'Closed' },
                { name: 'state', title: 'State' },
                { name: 'url', title: 'Link' }
            ],
            tableColumnExtensions: [
                //{ columnName: 'title', width: 180 },
                { columnName: 'createdAt', width: 90 },
                { columnName: 'updatedAt', width: 90 },
                { columnName: 'closedAt', width: 90 },
                { columnName: 'state', width: 90 },
                { columnName: 'url', width: 40 },
            ],
            linkColumns: ['url'],
            dateColumns: ['createdAt', 'updatedAt', 'closedAt'],
            hiddenColumnNames: ['updatedAt'],
            currentPage: 0,
            pageSize: 50,
            pageSizes: [20, 50, 100],

        };
        this.changeCurrentPage = currentPage => this.setState({ currentPage });
        this.changePageSize = pageSize => this.setState({ pageSize });
        this.hiddenColumnNamesChange = (hiddenColumnNames) => {
            this.setState({ hiddenColumnNames });
        };
    }

    render() {
        const { classes, issuesLoading, filtersResults } = this.props;
        const { columns, linkColumns, pageSize, pageSizes, currentPage, dateColumns, hiddenColumnNames, tableColumnExtensions} = this.state;

        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardContent>
                        <Grid
                            rows={filtersResults}
                            columns={columns}
                        >
                            <PagingState
                            currentPage={currentPage}
                            onCurrentPageChange={this.changeCurrentPage}
                            pageSize={pageSize}
                            onPageSizeChange={this.changePageSize}
                            />
                            <IntegratedPaging />
                            <DateTypeProvider
                                for={dateColumns}
                            />
                            <LinkTypeProvider
                                for={linkColumns}
                            />
                            <Table columnExtensions={tableColumnExtensions} />
                            <TableHeaderRow />
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

const mapState = state => ({
    issuesLoading: state.github.issuesLoading,
    filtersResults: state.data.results,
});


export default connect(mapState, null)(withStyles(styles)(IssuesTable));
