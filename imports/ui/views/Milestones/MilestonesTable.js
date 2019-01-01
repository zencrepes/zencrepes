import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import EyeIcon from 'mdi-react/EyeIcon';

import TableActionButtons from './TableActionButtons.js';

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
    Toolbar,
} from '@devexpress/dx-react-grid-material-ui';

const StatesFormatter = ({ value }) => {
    return value.map(state => (
        <div key={state.value}>{state.value}</div>
    ))
};
StatesFormatter.propTypes = {
    value: PropTypes.array.isRequired,
};

const StatesTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={StatesFormatter}
        {...props}
    />
);

const ReposFormatter = ({ value }) => {
    if (value.length > 1) {
        return value.length;
    } else {
        return '1 (' + value[0].repo.name + ')';
    }
};
ReposFormatter.propTypes = {
    value: PropTypes.array.isRequired,
};


const ReposTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={ReposFormatter}
        {...props}
    />
);

const IssuesFormatter = ({ value }) => {
    return value.filter(label => label.issues !== undefined).map(label => label.issues.totalCount).reduce((acc, count) => acc + count, 0);
};
IssuesFormatter.propTypes = {
    value: PropTypes.array.isRequired,
};

const IssuesTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={IssuesFormatter}
        {...props}
    />
);

const ActionsFormatter = ({ value }) => {
    return <TableActionButtons key={value.title} milestonesdata={value} />
};
ActionsFormatter.propTypes = {
    value: PropTypes.object.isRequired,
};

const ActionsTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={ActionsFormatter}
        {...props}
    />
);

const EditLabelFormatter = ({ value }) => {
    return <Link to={"/labels/view/" + value}><EyeIcon /></Link>;
};
EditLabelFormatter.propTypes = {
    value: PropTypes.string.isRequired,
};

const EditLabelTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={EditLabelFormatter}
        {...props}
    />
);

class MilestonesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'edit', title: 'Edit', getCellValue: row => row.title },
                { name: 'title', title: 'Title' },
                { name: 'repos', title: 'Repos Count', getCellValue: row => row.milestones },
                { name: 'issues', title: 'Issues Count', getCellValue: row => row.milestones },
                { name: 'states', title: 'State' },
                { name: 'actions', title: 'Actions', getCellValue: row => row },
            ],
            tableColumnExtensions: [
                { columnName: 'edit', width: 60 },
                { columnName: 'title', width: 200 },
                { columnName: 'repos', width: 150 },
                { columnName: 'issues', width: 90 },
                { columnName: 'states', width: 100 },
            ],
            statesColumns: ['states'],
            reposColumns: ['repos'],
            issuesColumns: ['issues'],
            actionsColumns: ['actions'],
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

    formatData() {
        const { milestones } = this.props;
        let uniqueTitles = _.groupBy(milestones, 'title');

        let milestonesdata = [];
        Object.keys(uniqueTitles).map(idx => {
            let stateElements = _.groupBy(uniqueTitles[idx], 'state');
            let states = Object.keys(stateElements).map(idx => {return {
                items: stateElements[idx],
                value: idx,
                count: stateElements[idx].length,
            }});
            states = _.sortBy(states, [function(o) {return o.count;}]);
            states = states.reverse();

            milestonesdata.push({
                title: idx,
                count: uniqueTitles[idx].length,
                milestones: uniqueTitles[idx],
                closedNoIssues: uniqueTitles[idx].filter(m => m.issues !== undefined).filter(m => {if (m.issues.totalCount === 0 && m.state.toLowerCase() === 'closed') {return true;}}),
                states: states,
            });
        });
        milestonesdata = _.sortBy(milestonesdata, ['count']);
        milestonesdata = milestonesdata.reverse();
        return milestonesdata;
    }

    render() {
        const { columns, pageSize, pageSizes, currentPage, statesColumns, reposColumns, issuesColumns, actionsColumns, editLabelColumns, tableColumnExtensions} = this.state;

        return (
            <Grid
                rows={this.formatData()}
                columns={columns}
            >
                <PagingState
                    currentPage={currentPage}
                    onCurrentPageChange={this.changeCurrentPage}
                    pageSize={pageSize}
                    onPageSizeChange={this.changePageSize}
                />
                <StatesTypeProvider
                    for={statesColumns}
                />
                <ReposTypeProvider
                    for={reposColumns}
                />
                <IssuesTypeProvider
                    for={issuesColumns}
                />
                <ActionsTypeProvider
                    for={actionsColumns}
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
        );
    }
}

MilestonesTable.propTypes = {
    classes: PropTypes.object.isRequired,
    milestones: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
};


const mapState = state => ({
    milestones: state.milestonesView.milestones,
});

export default connect(mapState, null)(MilestonesTable);
