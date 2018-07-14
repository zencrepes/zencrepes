import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { connect } from "react-redux";

import SquareIcon from 'mdi-react/SquareIcon';

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

const ColorsFormatter = ({ value }) => {
    return <SquareIcon color={value} />
};

const ColorsTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={ColorsFormatter}
        {...props}
    />
);

const DescriptionsFormatter = ({ value }) => {
    return value;
};

const DescriptionsTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={DescriptionsFormatter}
        {...props}
    />
);

class LabelsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'name', title: 'Label' },
                { name: 'org', title: 'Org', getCellValue: row => row.repo.login},
                { name: 'repo', title: 'Repo', getCellValue: row => row.repo.name},
                { name: 'issues', title: 'Issues Count', getCellValue: row => row.issues.totalCount},
                { name: 'color', title: 'Color', getCellValue: row => '#' + row.color},
                { name: 'description', title: 'Description' },
            ],
            tableColumnExtensions: [
                { columnName: 'name', width: 200 },
                { columnName: 'repo', width: 150 },
                { columnName: 'org', width: 90 },
                { columnName: 'color', width: 150 },
            ],
            colorsColumns: ['color'],
            descriptionsColumns: ['description'],
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
        const { columns, pageSize, pageSizes, currentPage, colorsColumns, descriptionsColumns, reposColumns, issuesColumns, tableColumnExtensions} = this.state;

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

LabelsTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});


const mapState = state => ({

});


export default connect(mapState, mapDispatch)(withStyles(styles)(LabelsTable));
