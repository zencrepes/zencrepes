import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { connect } from "react-redux";

import {ColorsTypeProvider, DescriptionsTypeProvider, LinkTypeProvider, EditLabelTypeProvider} from './utils/formatters.js';

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
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
});

class TableLabels extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                //{ name: 'edit', title: 'Edit', getCellValue: row => row.name },
                { name: 'edit', title: 'Edit', getCellValue: row => row.name },
                { name: 'org', title: 'Org', getCellValue: row => row.repo.org.login},
                { name: 'repo', title: 'Repo', getCellValue: row => row.repo.name},
                { name: 'issues', title: 'Issues Count', getCellValue: row => row.issues.totalCount},
                { name: 'color', title: 'Color', getCellValue: row => '#' + row.color},
                { name: 'description', title: 'Description' },
                { name: 'url', title: '' },
            ],
            tableColumnExtensions: [
                { columnName: 'edit', width: 60 },
                { columnName: 'repo', width: 150 },
                { columnName: 'org', width: 150 },
                { columnName: 'color', width: 150 },
                { columnName: 'issues', width: 90 },
                { columnName: 'url', width: 40 },
            ],
            colorsColumns: ['color'],
            descriptionsColumns: ['description'],
            linkColumns: ['url'],
            editLabelColumns: ['edit'],
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

    render() {
        const { classes, labelsdata } = this.props;
        const { columns, pageSize, pageSizes, currentPage, editLabelColumns, colorsColumns, descriptionsColumns, linkColumns, tableColumnExtensions} = this.state;

        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardContent>
                        <Grid
                            rows={labelsdata}
                            columns={columns}
                        >
                            <PagingState
                                currentPage={currentPage}
                                onCurrentPageChange={this.changeCurrentPage}
                                pageSize={pageSize}
                                onPageSizeChange={this.changePageSize}
                            />
                            <ColorsTypeProvider
                                for={colorsColumns}
                            />
                            <DescriptionsTypeProvider
                                for={descriptionsColumns}
                            />
                            <LinkTypeProvider
                                for={linkColumns}
                            />
                            <EditLabelTypeProvider
                                for={editLabelColumns}
                            />
                            <IntegratedPaging />
                            <Table columnExtensions={tableColumnExtensions} />
                            <TableHeaderRow />
                            <Toolbar />
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

TableLabels.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});


const mapState = state => ({

});


export default connect(mapState, mapDispatch)(withStyles(styles)(TableLabels));
