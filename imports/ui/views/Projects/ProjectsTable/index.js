import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {
    SortingState,
    PagingState,
    IntegratedPaging,
    IntegratedSorting,
    DataTypeProvider,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import {connect} from "react-redux";
import uuidv1 from "uuid/v1";

const StateFormatter = ({ value }) => {
    if (value === undefined) {
        return 'OPEN';
    } else {
        if (value.length > 1) {
            return (
                <React.Fragment>
                    MIXED
                </React.Fragment>
            );
        } else {
            if (value[0].name === 'OPEN') {
                return (
                    <React.Fragment>
                        OPEN
                    </React.Fragment>
                );
            } else {
                return (
                    <React.Fragment>
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
                0
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                {value.length}
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
        return value.filter(project => project.issues !== undefined).map(project => project.issues.totalCount).reduce((acc, count) => acc + count, 0);
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
        return value.filter(project => project.pullRequests !== undefined).map(project => project.pullRequests.totalCount).reduce((acc, count) => acc + count, 0);
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

const getRowId = row => row.id;

class ProjectsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'name', title: 'Name' },
                { name: 'state', title: 'State' },
                { name: 'issues', title: 'Issues', getCellValue: row => row.projects },
                { name: 'pullRequests', title: 'PRs', getCellValue: row => row.projects },
                { name: 'repos', title: 'Repos', getCellValue: row => row.projects },
            ],
            tableColumnExtensions: [
                { columnName: 'repos', width: 110 },
                { columnName: 'issues', width: 90 },
                { columnName: 'pullRequests', width: 90 },
                { columnName: 'dueOn', width: 200 },
                { columnName: 'state', width: 200 },
            ],
            columnOrder: ['name', 'state', 'issues', 'pullRequests', 'repos'],
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
        This function is just a proxy. it doesn't do much other than recording a "newProject" line
     */
    changeAddedRows = (addedRows) => {
        //Github requires a color to be set, by default setting this up to white
        const {
            setNewState,
            setNewTitle,
            setNewDueOn,
            setOpenEditDialog,
            projects,
            setProjects,
            setAction,
            setOnSuccess,
            updateView,
        } = this.props;
        //Empty data
        if (addedRows.length > 0) {
            setNewState('OPEN');
            setNewTitle('New Project');
            setNewDueOn(null);
            const uniqRepos = _.uniqWith(projects, (arrVal, othVal) => {
                if (arrVal.repo.id === othVal.repo.id) {
                    return true;
                }
                else {
                    return false;
                }
            });
            const createProjects = uniqRepos.map((mls) => {
                return {
                    org: mls.org,
                    repo: mls.repo,
                    id: uuidv1(),
                }
            });
            setProjects(createProjects);
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
            startEditingProject,
            setProjects,
            projects,
        } = this.props;
        const projectTitle = editingRowIds[0];
        const editProjects = projects.filter(mls => mls.title === projectTitle);
        setProjects(editProjects);
        startEditingProject();
        this.setState({ editingRowIds: [] });
    };

    commitChanges = ({ deleted, added }) => {
        const {
            projects,
            setProjects,
            setVerifFlag,
            setAction,
            setOnSuccess,
            setStageFlag,
            updateView
        } = this.props;
        if (added !== undefined && added.length !== 0) {
            // The plan here is to list repositories for which we'll be adding projects
            // As a hack, will be using list filtered by repositories
            const uniqRepos = _.uniqWith(projects, (arrVal, othVal) => {
                if (arrVal.repo.id === othVal.repo.id) {
                    return true;
                }
                else {
                    return false;
                }
            });
//            console.log(uniqRepos);
            const createProjects = uniqRepos.map((mls) => {
                return {
                    org: mls.org,
                    repo: mls.repo,
                    id: uuidv1(),
                }
            });
            setProjects(createProjects);
            setAction('create');
        } else if (deleted !== undefined && deleted.length !== 0) {
            const deleteProjects = projects.filter(mls => mls.title === deleted[0]);
            setProjects(deleteProjects);
            setAction('delete');
        } else {
            setAction('update');
        }
        setOnSuccess(updateView);
        setStageFlag(true);
        setVerifFlag(true);
    };

    formatData() {
        const { projects } = this.props;

        let uniqueProjects = _.groupBy(projects, 'name');

        let projectsdata = [];
        Object.keys(uniqueProjects).map(idx => {
            let stateElements = _.groupBy(uniqueProjects[idx], 'state');
            let state = Object.keys(stateElements).map(idx => {return {
                items: stateElements[idx],
                count: stateElements[idx].length,
                name: stateElements[idx][0].state,
            }});
            state = _.sortBy(state, [function(o) {return o.count;}]);
            state = state.reverse();

            projectsdata.push({
                name: idx,
                key: idx,
                id: idx,
                count: uniqueProjects[idx].length,
                projects: uniqueProjects[idx],
                state: state,
            });
        });
        projectsdata = _.sortBy(projectsdata, ['count']);
        projectsdata = projectsdata.reverse();
        return projectsdata;
    }

    render() {
        const {
            columns,
            tableColumnExtensions,
            sorting,
            currentPage,
            pageSize,
            pageSizes,
            stateColumns,
            reposColumns,
            issuesColumns,
            prColumns,
        } = this.state;

        return (
            <React.Fragment>
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
                    <PagingPanel
                        pageSizes={pageSizes}
                    />
                </Grid>
            </React.Fragment>
        );
    }
}

ProjectsTable.propTypes = {
    projects: PropTypes.array.isRequired,

    startEditingProject: PropTypes.func.isRequired,
    setVerifFlag: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
    setProjects: PropTypes.func.isRequired,
    setNewState: PropTypes.func.isRequired,
    setNewTitle: PropTypes.func.isRequired,
    setNewDueOn: PropTypes.func.isRequired,
    setOpenEditDialog: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    startEditingProject: dispatch.projectsEdit.startEditingProject,
    setVerifFlag: dispatch.projectsEdit.setVerifFlag,
    setAction: dispatch.projectsEdit.setAction,
    setStageFlag: dispatch.projectsEdit.setStageFlag,
    setDeleteWarning: dispatch.projectsEdit.setDeleteWarning,
    setProjects: dispatch.projectsEdit.setProjects,
    setNewState: dispatch.projectsEdit.setNewState,
    setNewTitle: dispatch.projectsEdit.setNewTitle,
    setNewDueOn: dispatch.projectsEdit.setNewDueOn,

    setOpenEditDialog: dispatch.projectsEdit.setOpenEditDialog,

    updateView: dispatch.projectsView.updateView,

    setOnSuccess: dispatch.loading.setOnSuccess,
});

export default connect(null, mapDispatch)(ProjectsTable);