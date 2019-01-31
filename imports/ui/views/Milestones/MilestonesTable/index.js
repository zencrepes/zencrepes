import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';

import SquareIcon from 'mdi-react/SquareIcon';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
//import CreateNewFolderIcon from '@material-ui/icons/create_new_folder

import EditMilestoneState from './EditMilestoneState.js';
import EditMilestoneTitle from './EditMilestoneTitle.js';
import EditMilestoneDueOn from './EditMilestoneDueOn.js';
import AddRepoButton from './AddRepoButton.js';
import AddRepos from './AddRepos/index.js';
import ReposTable from './ReposTable/index.js';
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
    if (value[0].name === undefined) {return '';}
    else {return value[0].name;}
/*    return value.map(color => (
        <SquareIcon key={color.name} color={color.name} />
    ))*/
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
    console.log(value);
    if (value[0].name === undefined) {return '';}
    else {return value[0].name;}
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

const LookupEditCellBase = ({
                                availableColumnValues, value, onValueChange,
                            }) => (
    <TableCell
    >
        <Select
            value={value}
            onChange={event => onValueChange(event.target.value)}
            input={(
                <Input
                />
            )}
        >
            {availableColumnValues.map(item => (
                <MenuItem key={item} value={item}>
                    {item}
                </MenuItem>
            ))}
        </Select>
    </TableCell>
);
LookupEditCellBase.propTypes = {
    availableColumnValues: PropTypes.array,
    value: PropTypes.string,
    onValueChange: PropTypes.func,
};

export const LookupEditCell = (LookupEditCellBase);

const Cell = (props) => {
    return <Table.Cell {...props} />;
};

const EditCell = (props) => {
    const { column, row } = props;
    if (column.name === 'title') {
        return (<TableEditRow.Cell {...props} ><EditMilestoneTitle /></TableEditRow.Cell>);
    } else if (column.name === 'dueOn') {
        return (<TableEditRow.Cell {...props} ><EditMilestoneDueOn /></TableEditRow.Cell>);
    } else if (column.name === 'state') {
        return (<TableEditRow.Cell {...props} ><EditMilestoneState /></TableEditRow.Cell>);
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
                { name: 'state', title: 'State' },
                { name: 'dueOn', title: 'Due On' },
                { name: 'issues', title: 'Issues', getCellValue: row => row.milestones },
                { name: 'pullRequests', title: 'PRs', getCellValue: row => row.milestones },
                { name: 'repos', title: 'Repos', getCellValue: row => row.milestones },
            ],
            tableColumnExtensions: [
//                { columnName: 'edit', width: 60 },
                { columnName: 'repos', width: 110 },
                { columnName: 'issues', width: 90 },
                { columnName: 'pullRequests', width: 90 },
                { columnName: 'dueOn', width: 110 },
                { columnName: 'state', width: 90 },
            ],
            columnOrder: ['title', 'dueOn', 'state', 'issues', 'pullRequests', 'repos'],
            dueOnColumns: ['dueOn'],
            stateColumns: ['state'],
            reposColumns: ['repos'],
            issuesColumns: ['issues'],
            prColumns: ['pullRequests'],
            editingStateColumnExtensions: [
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
        const { setNewColor, setNewDescription, setNewName } = this.props;
        //Empty data
        if (addedRows.length > 0) {
            setNewColor('FC5CA9');
            setNewDescription(null);
            setNewName('New Milestone');
        }
        this.setState({
            addedRows: addedRows.map(row => (Object.keys(row).length ? row : {
                newMilestone: true,
            })),
        })
    };

    changeEditingRowIds = (editingRowIds) => {
        const { startEditingMilestone } = this.props;
        if (this.state.editingRowIds.length > 0) {
            const editMilestone = editingRowIds.filter(el => el !== this.state.editingRowIds[0]);
            this.setState({ editingRowIds: editMilestone });
            startEditingMilestone(editMilestone[0]);
        } else {
            this.setState({ editingRowIds });
            startEditingMilestone(editingRowIds[0]);
        }
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
            let uniqRepos = _.uniqWith(milestones, (arrVal, othVal) => {
                if (arrVal.repo.id === othVal.repo.id) {
                    return true;
                }
                else {
                    return false;
                }
            });
            setMilestones(uniqRepos);
            setAction('create');
        } else if (deleted !== undefined && deleted.length !== 0) {
            const deleteMilestones = milestones.filter(lbl => lbl.name === deleted[0]);
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
            deletingRows,
            pageSize,
            pageSizes,
            dueOnColumns,
            stateColumns,
            reposColumns,
            issuesColumns,
            prColumns,
            editingStateColumnExtensions,
        } = this.state;

        return (
            <React.Fragment>
                <AddRepos />
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
};

const mapDispatch = dispatch => ({
    startEditingMilestone: dispatch.milestonesEdit.startEditingMilestone,
    setVerifFlag: dispatch.milestonesEdit.setVerifFlag,
    setAction: dispatch.milestonesEdit.setAction,
    setStageFlag: dispatch.milestonesEdit.setStageFlag,
    updateView: dispatch.milestonesView.updateView,
    setDeleteWarning: dispatch.milestonesEdit.setDeleteWarning,
    setMilestones: dispatch.milestonesEdit.setMilestones,
    setNewState: dispatch.milestonesEdit.setNewState,
    setNewTitle: dispatch.milestonesEdit.setNewTitle,
    setNewDueOn: dispatch.milestonesEdit.setNewDueOn,

    setOnSuccess: dispatch.loading.setOnSuccess,

});

export default connect(null, mapDispatch)(MilestonesTable);