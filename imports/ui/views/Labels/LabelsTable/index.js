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

import EditLabelColor from './EditLabelColor.js';
import EditLabelName from './EditLabelName.js';
import EditLabelDescription from './EditLabelDescription.js';
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
            labels={row.labels}
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


const ColorsFormatter = ({ value }) => {
    return value.map(color => (
        <SquareIcon key={color.name} color={color.name} />
    ))
};
ColorsFormatter.propTypes = {
    value: PropTypes.array,
};

const ColorsTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={ColorsFormatter}
        {...props}
    />
);

const DescriptionsFormatter = ({ value }) => {
    if (value[0].name === undefined) {return '';}
    else {return value[0].name;}
};
DescriptionsFormatter.propTypes = {
    value: PropTypes.array,
};

const DescriptionsTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={DescriptionsFormatter}
        {...props}
    />
);

const ReposFormatter = ({ value }) => {
    if (value === undefined) {
        return (
            <React.Fragment>
                0 <AddRepoButton labels={value}/>
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                {value.length} <AddRepoButton labels={value}/>
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
        return value.filter(label => label.issues !== undefined).map(label => label.issues.totalCount).reduce((acc, count) => acc + count, 0);
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
        return value.filter(label => label.pullRequests !== undefined).map(label => label.pullRequests.totalCount).reduce((acc, count) => acc + count, 0);
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
    if (column.name === 'name') {
        return (<TableEditRow.Cell {...props} ><EditLabelName /></TableEditRow.Cell>);
    } else if (column.name === 'descriptions') {
        return (<TableEditRow.Cell {...props} ><EditLabelDescription /></TableEditRow.Cell>);
    } else if (column.name === 'colors') {
        return (<TableEditRow.Cell {...props} ><EditLabelColor /></TableEditRow.Cell>);
    } else if (column.name === 'repos') {
        return (<TableEditRow.Cell {...props} ><ReposFormatter value={row.labels} /></TableEditRow.Cell>);
    } else if (column.name === 'issues') {
        return (<TableEditRow.Cell {...props} ><IssuesFormatter value={row.labels} /></TableEditRow.Cell>);
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

class LabelsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'name', title: 'Label' },
                { name: 'colors', title: 'Colors' },
                { name: 'descriptions', title: 'Description' },
                { name: 'issues', title: 'Issues', getCellValue: row => row.labels },
                { name: 'pullRequests', title: 'PRs', getCellValue: row => row.labels },
                { name: 'repos', title: 'Repos', getCellValue: row => row.labels },
            ],
            tableColumnExtensions: [
//                { columnName: 'edit', width: 60 },
                { columnName: 'name', width: 200 },
                { columnName: 'repos', width: 110 },
                { columnName: 'issues', width: 90 },
                { columnName: 'pullRequests', width: 90 },
                { columnName: 'colors', width: 150 },
            ],
            columnOrder: ['name', 'colors', 'descriptions', 'issues', 'pullRequests', 'repos'],
            colorsColumns: ['colors'],
            descriptionsColumns: ['descriptions'],
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
        This function is just a proxy. it doesn't do much other than recording a "newLabel" line
     */
    changeAddedRows = (addedRows) => {
        //Github requires a color to be set, by default setting this up to white
        const { setNewColor, setNewDescription, setNewName } = this.props;
        //Empty data
        if (addedRows.length > 0) {
            setNewColor('FC5CA9');
            setNewDescription('');
            setNewName('New Label');
        }
        this.setState({
            addedRows: addedRows.map(row => (Object.keys(row).length ? row : {
                newLabel: true,
            })),
        })
    };

    changeEditingRowIds = (editingRowIds) => {
        const { startEditingLabel } = this.props;
        if (this.state.editingRowIds.length > 0) {
            const editLabel = editingRowIds.filter(el => el !== this.state.editingRowIds[0]);
            this.setState({ editingRowIds: editLabel });
            startEditingLabel(editLabel[0]);
        } else {
            this.setState({ editingRowIds });
            startEditingLabel(editingRowIds[0]);
        }
    };

    commitChanges = ({ deleted, added }) => {
        const {
            labels,
            setLabels,
            setVerifFlag,
            setAction,
            setOnSuccess,
            setVerifying,
            setStageFlag,
            updateView
        } = this.props;
        if (added !== undefined && added.length !== 0) {
            // The plan here is to list repositories for which we'll be adding labels
            // As a hack, will be using list filtered by repositories
            let uniqRepos = _.uniqWith(labels, (arrVal, othVal) => {
                if (arrVal.repo.id === othVal.repo.id) {
                    return true;
                }
                else {
                    return false;
                }
            });
            setLabels(uniqRepos);
            setAction('create');
        } else if (deleted !== undefined && deleted.length !== 0) {
            const deleteLabels = labels.filter(lbl => lbl.name === deleted[0]);
            setLabels(deleteLabels);
            setAction('delete');
        } else {
            setAction('update');
        }
        setOnSuccess(updateView);
        setVerifying(true);
        setStageFlag(true);
        setVerifFlag(true);
    };

    formatData() {
        const { labels } = this.props;

        let uniqueLabels = _.groupBy(labels, 'name');

        let labelsdata = [];
        Object.keys(uniqueLabels).map(idx => {
            let colorElements = _.groupBy(uniqueLabels[idx], 'color');
            let colors = Object.keys(colorElements).map(idx => {return {
                items: colorElements[idx],
                count: colorElements[idx].length,
                name: "#" + colorElements[idx][0].color,
            }});
            colors = _.sortBy(colors, [function(o) {return o.count;}]);
            colors = colors.reverse();

            let descriptionsElements = _.groupBy(uniqueLabels[idx], 'description');
            let descriptions = Object.keys(descriptionsElements).map(idx => {return {
                items: descriptionsElements[idx],
                count: descriptionsElements[idx].length,
                name: descriptionsElements[idx][0].description,
            }});
            descriptions = _.sortBy(descriptions, [function(o) {return o.count;}]);
            descriptions = descriptions.reverse();

            labelsdata.push({
                name: idx,
                key: idx,
                id: idx,
                count: uniqueLabels[idx].length,
                labels: uniqueLabels[idx],
                colors: colors,
                descriptions: descriptions,
            });
        });
        labelsdata = _.sortBy(labelsdata, ['count']);
        labelsdata = labelsdata.reverse();
        return labelsdata;
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
            colorsColumns,
            descriptionsColumns,
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
                    <ColorsTypeProvider
                        for={colorsColumns}
                    />
                    <DescriptionsTypeProvider
                        for={descriptionsColumns}
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
                <Dialog
                    open={!!deletingRows.length}
                    onClose={this.cancelDelete}
                >
                    <DialogTitle>
                        Delete Row
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete the following row?
                        </DialogContentText>
                        <Paper>
                            <Grid
                                rows={this.formatData().filter(row => deletingRows.indexOf(row.id) > -1)}
                                columns={columns}
                            >
                                <Table
                                    columnExtensions={tableColumnExtensions}
                                    cellComponent={Cell}
                                />
                                <TableHeaderRow />
                            </Grid>
                        </Paper>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.cancelDelete} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.deleteRows} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>

        );
    }
}

LabelsTable.propTypes = {
    labels: PropTypes.array.isRequired,

    startEditingLabel: PropTypes.func.isRequired,
    setVerifFlag: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    setVerifying: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
    setLabels: PropTypes.func.isRequired,
    setNewColor: PropTypes.func.isRequired,
    setNewName: PropTypes.func.isRequired,
    setNewDescription: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    startEditingLabel: dispatch.labelsEdit.startEditingLabel,
    setVerifFlag: dispatch.labelsEdit.setVerifFlag,
    setAction: dispatch.labelsEdit.setAction,
    setOnSuccess: dispatch.labelsEdit.setOnSuccess,
    setVerifying: dispatch.labelsEdit.setVerifying,
    setStageFlag: dispatch.labelsEdit.setStageFlag,
    updateView: dispatch.labelsView.updateView,
    setDeleteWarning: dispatch.labelsEdit.setDeleteWarning,
    setLabels: dispatch.labelsEdit.setLabels,
    setNewColor: dispatch.labelsEdit.setNewColor,
    setNewName: dispatch.labelsEdit.setNewName,
    setNewDescription: dispatch.labelsEdit.setNewDescription,
});

export default connect(null, mapDispatch)(LabelsTable);