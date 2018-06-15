import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import { connect } from "react-redux";

import { cfgQueries } from '../../../data/Queries.js';
import {buildMongoSelector} from "../../../utils/mongo/index.js";

import {
    // State or Local Processing Plugins
    SelectionState,
    PagingState,
    IntegratedSelection,
    IntegratedPaging,
    DataTypeProvider,
    RowDetailState,
    EditingState
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
    TableRowDetail,
    TableEditRow,
    TableEditColumn,
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

const RowDetail = ({ row }) => (
    <div>{JSON.stringify(buildMongoSelector(JSON.parse(row.filters)))}</div>
);

class QueriesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'name', title: 'Name' },
                { name: 'mongo', title: 'Mongo Fitler' },
            ],
            currentPage: 0,
            pageSize: 10,
            pageSizes: [10, 20, 30],
            editingStateColumnExtensions: [
                { columnName: 'mongo', editingEnabled: false },
            ],
        };
        this.changeCurrentPage = currentPage => this.setState({ currentPage });
        this.changePageSize = pageSize => this.setState({ pageSize });
    }

    doesQueryNameExists = (name) => {
        if (cfgQueries.find({'name': {$eq: name}}).count() > 0) {
            console.log('changeQueryName - This query name already exists');
            return true;
        } else {
            console.log('changeQueryName - This query name does not exists');
            return false;
        }
    };

    commitChanges = ({ added, changed, deleted }) => {
        const { classes, queriesList } = this.props;
        if (changed) {
            console.log('Editing:');
            console.log(changed);
            for (var idx of Object.keys(changed)) {
                if (changed[idx].name !== undefined) {
                    if (!this.doesQueryNameExists(changed[idx].name)) {
                        cfgQueries.upsert({_id: queriesList[idx]._id}, { $set: { name: changed[idx].name } });
                    }
                }
//                console.log(queriesList[idx]);
            }
        } else if (deleted) {
            console.log('Deleting:');
            console.log(deleted);
            for (var idx of deleted) {
                cfgQueries.remove({_id: queriesList[idx]._id});
            }
        }
    };

    render() {
        const { classes, queriesList } = this.props;
        const { columns, pageSize, pageSizes, currentPage, editingStateColumnExtensions } = this.state;

        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardContent>
                        <Grid
                            rows={queriesList}
                            columns={columns}
                        >
                            <PagingState
                                currentPage={currentPage}
                                onCurrentPageChange={this.changeCurrentPage}
                                pageSize={pageSize}
                                onPageSizeChange={this.changePageSize}
                            />
                            <RowDetailState />
                            <IntegratedPaging />
                            <EditingState
                                onCommitChanges={this.commitChanges}
                                columnExtensions={editingStateColumnExtensions}
                            />
                            <Table />
                            <TableHeaderRow />
                            <TableRowDetail
                                contentComponent={RowDetail}
                            />
                            <Toolbar />
                            <PagingPanel
                                pageSizes={pageSizes}
                            />
                            <TableEditRow />
                            <TableEditColumn
                                showEditCommand
                                showDeleteCommand
                            />
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

QueriesTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});


const mapState = state => ({

});


export default
    connect(mapState, mapDispatch)
    (
        withTracker(() => {return {queriesList: cfgQueries.find({}).fetch()}})
        (
            withStyles(styles)(QueriesTable)
        )
    );


//export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesTable));
