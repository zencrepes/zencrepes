import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';

import EditMilestoneTitle from './EditMilestoneTitle.js';
import EditMilestoneDueOn from './EditMilestoneDueOn.js';
import AddRepoButton from './AddRepoButton.js';
import AddRepos from '../../../components/Milestones/AddRepos/index.js';
import ReposTable from './ReposTable/index.js';
import SetMilestoneClosedButton from './SetMilestoneClosedButton.js';
import SetMilestoneOpenButton from './SetMilestoneOpenButton.js';

import {
    SortingState,
    EditingState,
    PagingState,
    IntegratedPaging,
    IntegratedSorting,
    DataTypeProvider,
    RowDetailState,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,
    PagingPanel,
    TableRowDetail,
} from '@devexpress/dx-react-grid-material-ui';
import {connect} from "react-redux";
import uuidv1 from "uuid/v1";

const RowDetail = ({ row }) => {
    return (
        <ReposTable
            milestones={row.milestones}
        />
    );
};
RowDetail.propTypes = {
    row: PropTypes.object,
};

const AddButton = ({ onExecute }) => (
    <div style={{ textAlign: 'center' }}>
        <Button
            color="primary"
            onClick={onExecute}
            title="Create new row"
        >
            New
        </Button>
    </div>
);
AddButton.propTypes = {
    onExecute: PropTypes.func,
};

const EditButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Edit row">
        <EditIcon />
    </IconButton>
);
EditButton.propTypes = {
    onExecute: PropTypes.func,
};

const DeleteButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Delete row">
        <DeleteIcon />
    </IconButton>
);
DeleteButton.propTypes = {
    onExecute: PropTypes.func,
};

const CommitButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Save changes">
        <SaveIcon />
    </IconButton>
);
CommitButton.propTypes = {
    onExecute: PropTypes.func,
};

const CancelButton = ({ onExecute }) => (
    <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
        <CancelIcon />
    </IconButton>
);
CancelButton.propTypes = {
    onExecute: PropTypes.func,
};

const commandComponents = {
    add: AddButton,
    edit: EditButton,
    delete: DeleteButton,
    commit: CommitButton,
    cancel: CancelButton,
};

const Command = ({ id, onExecute }) => {
    const CommandButton = commandComponents[id];
    return (
        <CommandButton
            onExecute={onExecute}
        />
    );
};
Command.propTypes = {
    id: PropTypes.string,
    onExecute: PropTypes.func,
};


const DueOnFormatter = ({ value }) => {
//    console.log(value[0].name);
    let formattedDueOn = 'Not Set';
    if (value[0].name !== null) {
        formattedDueOn = value[0].name.slice(0,10);
//        const dueOn = new Date(value[0].name);
//        formattedDueOn = dueOn.getFullYear() + "-" + (dueOn.getMonth()+1 < 10 ? '0' : '') + (dueOn.getMonth()+1) + "-" + (dueOn.getDate() < 10 ? '0' : '') + (dueOn.getDate());
    }
    return formattedDueOn;
};
DueOnFormatter.propTypes = {
    value: PropTypes.array,
};

const DueOnTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={DueOnFormatter}
        {...props}
    />
);

const StateFormatter = ({ value }) => {
    if (value === undefined) {
        return 'OPEN';
    } else {
        const openMilestones = value.filter(mls => mls.name === 'OPEN');
        const closedMilestones = value.filter(mls => mls.name === 'CLOSED');
        if (value.length > 1) {
            return (
                <React.Fragment>
                    <SetMilestoneClosedButton milestones={openMilestones[0].items}/>
                    <SetMilestoneOpenButton milestones={closedMilestones[0].items}/>
                    MIXED
                </React.Fragment>
            );
        } else {
            if (value[0].name === 'OPEN') {
                return (
                    <React.Fragment>
                        <SetMilestoneClosedButton milestones={openMilestones[0].items}/>
                        OPEN
                    </React.Fragment>
                );
            } else {
                return (
                    <React.Fragment>
                        <SetMilestoneOpenButton milestones={closedMilestones[0].items}/>
                        CLOSED
                    </React.Fragment>
                );
            }
            /*
            if (value[0].name === undefined) {
                return value[0].state;
            } else {
                return value[0].name;
            }
            */
        }
    }
};
StateFormatter.propTypes = {
    value: PropTypes.array,
};

const StateTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={StateFormatter}
        {...props}
    />
);

const ReposFormatter = ({ value }) => {
    if (value === undefined) {
        return (
            <React.Fragment>
                0 <AddRepoButton milestones={value}/>
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                {value.length} <AddRepoButton milestones={value}/>
            </React.Fragment>
        );
    }
};
ReposFormatter.propTypes = {
    value: PropTypes.array,
};

const ReposTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={ReposFormatter}
        {...props}
    />
);

const IssuesFormatter = ({ value }) => {
    if (value === undefined) {
        return 0
    } else {
        return value.filter(milestone => milestone.issues !== undefined).map(milestone => milestone.issues.totalCount).reduce((acc, count) => acc + count, 0);
    }
};
IssuesFormatter.propTypes = {
    value: PropTypes.array,
};


const IssuesTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={IssuesFormatter}
        {...props}
    />
);

const PrFormatter = ({ value }) => {
    if (value === undefined) {
        return 0
    } else {
        return value.filter(milestone => milestone.pullRequests !== undefined).map(milestone => milestone.pullRequests.totalCount).reduce((acc, count) => acc + count, 0);
    }
};
PrFormatter.propTypes = {
    value: PropTypes.array,
};


const PrTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={PrFormatter}
        {...props}
    />
);

const Cell = (props) => {
    return <Table.Cell {...props} />;
};

const EditCell = (props) => {
    const { column, row } = props;
    if (column.name === 'title') {
        return (<TableEditRow.Cell {...props} ><EditMilestoneTitle /></TableEditRow.Cell>);
    } else if (column.name === 'dueOn') {
        return (<TableEditRow.Cell {...props} ><EditMilestoneDueOn value={row.milestones} /></TableEditRow.Cell>);
    } else if (column.name === 'state') {
        return (<TableEditRow.Cell {...props} ><StateFormatter value={row.milestones} /></TableEditRow.Cell>);
    } else if (column.name === 'repos') {
        return (<TableEditRow.Cell {...props} ><ReposFormatter value={row.milestones} /></TableEditRow.Cell>);
    } else if (column.name === 'issues') {
        return (<TableEditRow.Cell {...props} ><IssuesFormatter value={row.milestones} /></TableEditRow.Cell>);
    } else if (column.name === 'pullRequests') {
        return (<TableEditRow.Cell {...props} ><PrFormatter value={row.pullRequests} /></TableEditRow.Cell>);
    }
    return <TableEditRow.Cell {...props} />;
};
EditCell.propTypes = {
    column: PropTypes.object,
    row: PropTypes.object,
};

const getRowId = row => row.id;

class MilestonesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'title', title: 'Title' },
                { name: 'dueOn', title: 'Due On' },
                { name: 'state', title: 'State' },
                { name: 'issues', title: 'Issues', getCellValue: row => row.milestones },
                { name: 'pullRequests', title: 'PRs', getCellValue: row => row.milestones },
                { name: 'repos', title: 'Repos', getCellValue: row => row.milestones },
            ],
            tableColumnExtensions: [
                { columnName: 'repos', width: 110 },
                { columnName: 'issues', width: 90 },
                { columnName: 'pullRequests', width: 90 },
                { columnName: 'dueOn', width: 200 },
                { columnName: 'state', width: 200 },
            ],
            columnOrder: ['title', 'dueOn', 'state', 'issues', 'pullRequests', 'repos'],
            dueOnColumns: ['dueOn'],
            stateColumns: ['state'],
            reposColumns: ['repos'],
            issuesColumns: ['issues'],
            prColumns: ['pullRequests'],
            editingStateColumnExtensions: [
                { columnName: 'state', editingEnabled: false },
                { columnName: 'repos', editingEnabled: false },
                { columnName: 'issues', editingEnabled: false },
                { columnName: 'pullRequests', editingEnabled: false },
            ],
            sorting: [],
            editingRowIds: [],
            addedRows: [],
            rowChanges: {},
            currentPage: 0,
            deletingRows: [],
            pageSize: 50,
            pageSizes: [20, 50, 100, 0],
            selection: [],

        };
        const getStateDeletingRows = () => {
            const { deletingRows } = this.state;
            return deletingRows;
        };
        const getStateRows = () => {
            const { rows } = this.state;
            return rows;
        };

        this.changeSorting = sorting => this.setState({ sorting });

        this.changeRowChanges = rowChanges => this.setState({ rowChanges });
        this.changeCurrentPage = currentPage => this.setState({ currentPage });
        this.changePageSize = pageSize => this.setState({ pageSize });

        this.cancelDelete = () => this.setState({ deletingRows: [] });
        this.deleteRows = () => {
            const rows = getStateRows().slice();
            getStateDeletingRows().forEach((rowId) => {
                const index = rows.findIndex(row => row.id === rowId);
                if (index > -1) {
                    rows.splice(index, 1);
                }
            });
            this.setState({ rows, deletingRows: [] });
        };
        this.changeColumnOrder = (order) => {
            this.setState({ columnOrder: order });
        };
    }

    /*
        This function is just a proxy. it doesn't do much other than recording a "newMilestone" line
     */
    changeAddedRows = (addedRows) => {
        //Github requires a color to be set, by default setting this up to white
        const {
            setNewState,
            setNewTitle,
            setNewDueOn,
            setOpenEditDialog,
            milestones,
            setMilestones,
            setAction,
            setOnSuccess,
            updateView,
        } = this.props;
        //Empty data
        if (addedRows.length > 0) {
            setNewState('OPEN');
            setNewTitle('New Milestone');
            setNewDueOn(null);
            const uniqRepos = _.uniqWith(milestones, (arrVal, othVal) => {
                if (arrVal.repo.id === othVal.repo.id) {
                    return true;
                }
                else {
                    return false;
                }
            });
            const createMilestones = uniqRepos.map((mls) => {
                return {
                    org: mls.org,
                    repo: mls.repo,
                    id: uuidv1(),
                }
            });
            setMilestones(createMilestones);
            setAction('create');
            setOnSuccess(updateView);
            setOpenEditDialog(true);
        }
        this.setState({
            addedRows: [],
        })
    };

    changeEditingRowIds = (editingRowIds) => {
        const {
            startEditingMilestone,
            setMilestones,
            milestones,
        } = this.props;
        const milestoneTitle = editingRowIds[0];
        const editMilestones = milestones.filter(mls => mls.title === milestoneTitle);
        setMilestones(editMilestones);
        startEditingMilestone();
        this.setState({ editingRowIds: [] });
    };

    commitChanges = ({ deleted, added }) => {
        const {
            milestones,
            setMilestones,
            setVerifFlag,
            setAction,
            setOnSuccess,
            setStageFlag,
            updateView
        } = this.props;
        if (added !== undefined && added.length !== 0) {
            // The plan here is to list repositories for which we'll be adding milestones
            // As a hack, will be using list filtered by repositories
            const uniqRepos = _.uniqWith(milestones, (arrVal, othVal) => {
                if (arrVal.repo.id === othVal.repo.id) {
                    return true;
                }
                else {
                    return false;
                }
            });
//            console.log(uniqRepos);
            const createMilestones = uniqRepos.map((mls) => {
                return {
                    org: mls.org,
                    repo: mls.repo,
                    id: uuidv1(),
                }
            });
            setMilestones(createMilestones);
            setAction('create');
        } else if (deleted !== undefined && deleted.length !== 0) {
            const deleteMilestones = milestones.filter(mls => mls.title === deleted[0]);
            setMilestones(deleteMilestones);
            setAction('delete');
        } else {
            setAction('update');
        }
        setOnSuccess(updateView);
        setStageFlag(true);
        setVerifFlag(true);
    };

    formatData() {
        const { milestones } = this.props;

        let uniqueMilestones = _.groupBy(milestones, 'title');

        let milestonesdata = [];
        Object.keys(uniqueMilestones).map(idx => {
            let dueOnElements = _.groupBy(uniqueMilestones[idx], 'dueOn');
            let dueOn = Object.keys(dueOnElements).map(idx => {return {
                items: dueOnElements[idx],
                count: dueOnElements[idx].length,
                name: dueOnElements[idx][0].dueOn,
            }});
            dueOn = _.sortBy(dueOn, [function(o) {return o.count;}]);
            dueOn = dueOn.reverse();

            let stateElements = _.groupBy(uniqueMilestones[idx], 'state');
            let state = Object.keys(stateElements).map(idx => {return {
                items: stateElements[idx],
                count: stateElements[idx].length,
                name: stateElements[idx][0].state,
            }});
            state = _.sortBy(state, [function(o) {return o.count;}]);
            state = state.reverse();

            milestonesdata.push({
                title: idx,
                key: idx,
                id: idx,
                count: uniqueMilestones[idx].length,
                milestones: uniqueMilestones[idx],
                dueOn: dueOn,
                state: state,
            });
        });
        milestonesdata = _.sortBy(milestonesdata, ['count']);
        milestonesdata = milestonesdata.reverse();
        return milestonesdata;
    }

    render() {
        const {
            columns,
            tableColumnExtensions,
            sorting,
            editingRowIds,
            addedRows,
            rowChanges,
            currentPage,
//            deletingRows,
            pageSize,
            pageSizes,
            dueOnColumns,
            stateColumns,
            reposColumns,
            issuesColumns,
            prColumns,
            updateView,
            editingStateColumnExtensions,
        } = this.state;

        return (
            <React.Fragment>
                <AddRepos updateView={updateView} />
                <Grid
                    rows={this.formatData()}
                    columns={columns}
                    getRowId={getRowId}
                >
                    <SortingState
                        sorting={sorting}
                        onSortingChange={this.changeSorting}
                    />
                    <PagingState
                        currentPage={currentPage}
                        onCurrentPageChange={this.changeCurrentPage}
                        pageSize={pageSize}
                        onPageSizeChange={this.changePageSize}
                    />
                    <EditingState
                        editingRowIds={editingRowIds}
                        columnExtensions={editingStateColumnExtensions}
                        onEditingRowIdsChange={this.changeEditingRowIds}
                        rowChanges={rowChanges}
                        onRowChangesChange={this.changeRowChanges}
                        addedRows={addedRows}
                        onAddedRowsChange={this.changeAddedRows}
                        onCommitChanges={this.commitChanges}
                    />
                    <RowDetailState
                        defaultExpandedRowIds={[]}
                    />
                    <DueOnTypeProvider
                        for={dueOnColumns}
                    />
                    <StateTypeProvider
                        for={stateColumns}
                    />
                    <ReposTypeProvider
                        for={reposColumns}
                    />
                    <IssuesTypeProvider
                        for={issuesColumns}
                    />
                    <PrTypeProvider
                        for={prColumns}
                    />
                    <IntegratedSorting />
                    <IntegratedPaging />

                    <Table
                        columnExtensions={tableColumnExtensions}
                        cellComponent={Cell}
                    />
                    <TableHeaderRow
                        showSortingControls
                    />
                    <TableEditRow
                        cellComponent={EditCell}
                    />
                    <TableEditColumn
                        showAddCommand={!addedRows.length}
                        showEditCommand
                        showDeleteCommand
                        commandComponent={Command}
                    />
                    <TableRowDetail
                        contentComponent={RowDetail}
                    />
                    <PagingPanel
                        pageSizes={pageSizes}
                    />
                </Grid>
            </React.Fragment>
        );
    }
}

MilestonesTable.propTypes = {
    milestones: PropTypes.array.isRequired,

    startEditingMilestone: PropTypes.func.isRequired,
    setVerifFlag: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
    setMilestones: PropTypes.func.isRequired,
    setNewState: PropTypes.func.isRequired,
    setNewTitle: PropTypes.func.isRequired,
    setNewDueOn: PropTypes.func.isRequired,
    setOpenEditDialog: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    startEditingMilestone: dispatch.milestonesEdit.startEditingMilestone,
    setVerifFlag: dispatch.milestonesEdit.setVerifFlag,
    setAction: dispatch.milestonesEdit.setAction,
    setStageFlag: dispatch.milestonesEdit.setStageFlag,
    setDeleteWarning: dispatch.milestonesEdit.setDeleteWarning,
    setMilestones: dispatch.milestonesEdit.setMilestones,
    setNewState: dispatch.milestonesEdit.setNewState,
    setNewTitle: dispatch.milestonesEdit.setNewTitle,
    setNewDueOn: dispatch.milestonesEdit.setNewDueOn,

    setOpenEditDialog: dispatch.milestonesEdit.setOpenEditDialog,

    updateView: dispatch.milestonesView.updateView,

    setOnSuccess: dispatch.loading.setOnSuccess,
});

export default connect(null, mapDispatch)(MilestonesTable);