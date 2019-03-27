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

import {
    StateLabel,
} from '@primer/components';

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
                    <StateLabel status="issueOpened">Open</StateLabel>
                );
            } else {
                return (
                    <StateLabel status="issueClosed">Closed</StateLabel>
                );
            }
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
        return value.filter(project => project.issues !== undefined).map(project => project.issues.length).reduce((acc, count) => acc + count, 0);
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

const DatesFormatter = ({ value }) => {
    //return value;
    if (value === null) {
        return null;
    } else {
        return value.slice(0,10);
    }
};
DatesFormatter.propTypes = {
    value: PropTypes.string,
};


const DatesTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={DatesFormatter}
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
                { name: 'state', title: 'State' },
                { name: 'name', title: 'Name' },
                { name: 'createdAt', title: 'Created', getCellValue: row => row.projects[0].createdAt },
                { name: 'updatedAt', title: 'Updated', getCellValue: row => row.projects[0].updatedAt },
                { name: 'closedAt', title: 'Closed', getCellValue: row => row.projects[0].closedAt },
                { name: 'issues', title: 'Issues', getCellValue: row => row.projects },
                { name: 'repos', title: 'Repos', getCellValue: row => row.projects },
            ],
            tableColumnExtensions: [
                { columnName: 'repos', width: 110 },
                { columnName: 'issues', width: 90 },
                { columnName: 'createdAt', width: 100 },
                { columnName: 'updatedAt', width: 100 },
                { columnName: 'closedAt', width: 100 },
                { columnName: 'state', width: 120 },
            ],
            columnOrder: ['state', 'name', 'createdAt', 'updatedAt', 'closedAt', 'issues', 'repos'],
            stateColumns: ['state'],
            reposColumns: ['repos'],
            issuesColumns: ['issues'],
            datesColumns: ['createdAt', 'updatedAt', 'closedAt'],
            sorting: [],
            currentPage: 0,
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
            datesColumns,
            issuesColumns,
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
                    <DatesTypeProvider
                        for={datesColumns}
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