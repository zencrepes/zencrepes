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

import ProjectLink from '../../../components/Links/ProjectLink/index.js'
import RepoLink from '../../../components/Links/RepoLink/index.js'
import OrgLink from '../../../components/Links/OrgLink/index.js'
import ManageButton from './ManageButton.js';

import {
    StateLabel,
} from '@primer/components';

const StateFormatter = ({ value }) => {
    if (value === 'OPEN') {
        return (
            <StateLabel status="issueOpened">Open</StateLabel>
        );
    } else {
        return (
            <StateLabel status="issueClosed">Closed</StateLabel>
        );
    }
};
StateFormatter.propTypes = {
    value: PropTypes.string,
};

const StateTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={StateFormatter}
        {...props}
    />
);


const NameFormatter = ({ value }) => {
    return <ProjectLink project={value} />;
};
NameFormatter.propTypes = {
    value: PropTypes.object,
};

const NameTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={NameFormatter}
        {...props}
    />
);

const ManageFormatter = ({ value }) => {
    return <ManageButton project={value} />;
};
ManageFormatter.propTypes = {
    value: PropTypes.object,
};

const ManageTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={ManageFormatter}
        {...props}
    />
);

const RepoFormatter = ({ value }) => {
    if (value.repo === undefined || value.repo === null) {
        return (
            <React.Fragment>
                -
            </React.Fragment>
        );
    } else {
        return <RepoLink repo={value.repo} />;
    }
};
RepoFormatter.propTypes = {
    value: PropTypes.object,
};

const RepoTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={RepoFormatter}
        {...props}
    />
);

const OrgFormatter = ({ value }) => {
    if (value.org === undefined || value.org === null) {
        return (
            <React.Fragment>
                -
            </React.Fragment>
        );
    } else {
        return <OrgLink org={value.org} />;
    }
};
OrgFormatter.propTypes = {
    value: PropTypes.object,
};

const OrgTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={OrgFormatter}
        {...props}
    />
);

const IssuesFormatter = ({ value }) => {
    if (value === undefined) {
        return 0
    } else {
        return value.issues.length;
//        return value.filter(project => project.issues !== undefined).map(project => project.issues.length).reduce((acc, count) => acc + count, 0);
    }
};
IssuesFormatter.propTypes = {
    value: PropTypes.object,
};

const IssuesTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={IssuesFormatter}
        {...props}
    />
);

const PendingCardsFormatter = ({ value }) => {
    if (value === undefined) {
        return 0
    } else {
        return value.pendingCards.totalCount;
        //return value.filter(project => project.pendingCards.totalCount !== undefined).map(project => project.pendingCards.totalCount).reduce((acc, count) => acc + count, 0);
    }
};
PendingCardsFormatter.propTypes = {
    value: PropTypes.object,
};


const PendingCardsTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={PendingCardsFormatter}
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

const compareString = (a, b) => {
    if (String(a).toLowerCase() < String(b).toLowerCase()) return -1;
    if (String(a).toLowerCase() > String(b).toLowerCase()) return 1;
    return 0;
};

const compareNumber = (a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
};

const compareName = (a, b) => {
    return compareString(a.name, b.name);
};

const compareOrg = (a, b) => {
    return compareString(a.org.login, b.org.login);
};

const compareRepo = (a, b) => {
    let compareA = '';
    if (a.repo === undefined || a.repo === null) {compareA = '-';}
    else {compareA = a.repo.name;}
    let compareB = '';
    if (b.repo === undefined || b.repo === null) {compareB = '-';}
    else {compareB = b.repo.name;}

    return compareString(compareA, compareB);
};

const compareIssues = (a, b) => {
    let compareA = 0;
    if (a === undefined) {compareA = 0;}
    else {compareA = a.issues.length;}
    let compareB = 0;
    if (b === undefined) {compareB = 0;}
    else {compareB = b.issues.length;}

    return compareNumber(compareA, compareB);
};

const comparePendingCards = (a, b) => {
    let compareA = 0;
    if (a === undefined) {compareA = 0;}
    else {compareA = a.pendingCards.totalCount;}
    let compareB = 0;
    if (b === undefined) {compareB = 0;}
    else {compareB = b.pendingCards.totalCount;}

    return compareNumber(compareA, compareB);
};

class ProjectsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'state', title: 'State' },
                { name: 'name', title: 'Name', getCellValue: row => row },
                { name: 'org', title: 'Org', getCellValue: row => row },
                { name: 'repo', title: 'Repo', getCellValue: row => row },
                { name: 'id', title: 'Manage', getCellValue: row => row},
                { name: 'createdAt', title: 'Created' },
                { name: 'updatedAt', title: 'Updated'},
                { name: 'closedAt', title: 'Closed' },
                { name: 'issues', title: 'Issues', getCellValue: row => row },
                { name: 'pendingCards', title: 'Pending', getCellValue: row => row },
            ],
            tableColumnExtensions: [
                { columnName: 'id', width: 90 },
                { columnName: 'repo', width: 100 },
                { columnName: 'org', width: 100 },
                { columnName: 'issues', width: 90 },
                { columnName: 'pendingCards', width: 90 },
                { columnName: 'createdAt', width: 100 },
                { columnName: 'updatedAt', width: 100 },
                { columnName: 'closedAt', width: 100 },
                { columnName: 'state', width: 120 },
            ],
            columnOrder: ['state', 'name', 'createdAt', 'updatedAt', 'closedAt', 'issues', 'repos'],
            nameColumns: ['name'],
            stateColumns: ['state'],
            manageColumns: ['id'],
            repoColumns: ['repo'],
            orgColumns: ['org'],
            issuesColumns: ['issues'],
            pendingCardsColumns: ['pendingCards'],
            datesColumns: ['createdAt', 'updatedAt', 'closedAt'],
            sortingStateColumnExtensions: [
                { columnName: 'id', sortingEnabled: false },
            ],
            integratedSortingColumnExtensions: [
                { columnName: 'name', compare: compareName },
                { columnName: 'org', compare: compareOrg },
                { columnName: 'repo', compare: compareRepo },
                { columnName: 'issues', compare: compareIssues },
                { columnName: 'pendingCards', compare: comparePendingCards },
            ],
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

    /*
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
    */

    render() {
        const {
            columns,
            tableColumnExtensions,
            sorting,
            currentPage,
            pageSize,
            pageSizes,
            stateColumns,
            manageColumns,
            nameColumns,
            repoColumns,
            orgColumns,
            datesColumns,
            issuesColumns,
            pendingCardsColumns,
            integratedSortingColumnExtensions,
            sortingStateColumnExtensions,
        } = this.state;
        const {
            projects,
        } = this.props;
        if (projects === undefined) {
            return null;
        } else {
            return (
                <React.Fragment>
                    <Grid
                        rows={projects}
                        columns={columns}
                        getRowId={getRowId}
                    >
                        <PagingState
                            currentPage={currentPage}
                            onCurrentPageChange={this.changeCurrentPage}
                            pageSize={pageSize}
                            onPageSizeChange={this.changePageSize}
                        />
                        <SortingState
                            sorting={sorting}
                            onSortingChange={this.changeSorting}
                            columnExtensions={sortingStateColumnExtensions}
                        />
                        <StateTypeProvider
                            for={stateColumns}
                        />
                        <NameTypeProvider
                            for={nameColumns}
                        />
                        <ManageTypeProvider
                            for={manageColumns}
                        />
                        <RepoTypeProvider
                            for={repoColumns}
                        />
                        <OrgTypeProvider
                            for={orgColumns}
                        />
                        <IssuesTypeProvider
                            for={issuesColumns}
                        />
                        <PendingCardsTypeProvider
                            for={pendingCardsColumns}
                        />
                        <DatesTypeProvider
                            for={datesColumns}
                        />
                        <IntegratedSorting
                            columnExtensions={integratedSortingColumnExtensions}
                        />
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