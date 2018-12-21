import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import SquareIcon from 'mdi-react/SquareIcon';
import PencilIcon from 'mdi-react/PencilIcon';
import EyeIcon from 'mdi-react/EyeIcon';

import EditIcon from '@material-ui/icons/Edit';

import TableActionButtons from './TableActionButtons.js';

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
import {cfgMilestones} from "../../../data/Minimongo";

const StatesFormatter = ({ value }) => {
    return value.map(state => (
        <div key={state.value}>{state.value}</div>
    ))
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

const ReposTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={ReposFormatter}
        {...props}
    />
);

const IssuesFormatter = ({ value }) => {
    return value.filter(label => label.issues !== undefined).map(label => label.issues.totalCount).reduce((acc, count) => acc + count, 0);
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

const ActionsTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={ActionsFormatter}
        {...props}
    />
);


const EditMilestoneFormatter = ({value}) => {
    return <Link to={"/milestones/edit?q=" + JSON.stringify(value)}><EditIcon /></Link>;
};

const EditMilestoneTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={EditMilestoneFormatter}
        {...props}
    />
);

const styles = theme => ({
    root: {
        textAlign: 'right'
    },
});

class MilestonesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'edit', title: 'Edit', getCellValue: row => row.query },
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
        const { milestones, query } = this.props;
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
                query: {...query, title: idx},
                states: states,
            });
        });
        milestonesdata = _.sortBy(milestonesdata, ['count']);
        milestonesdata = milestonesdata.reverse();
        return milestonesdata;
    }

    render() {
        const { classes, milestones, query } = this.props;
        const { columns, pageSize, pageSizes, currentPage, statesColumns, reposColumns, issuesColumns, actionsColumns, editLabelColumns, tableColumnExtensions} = this.state;

        return (
            <div className={classes.root}>
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
                    <EditMilestoneTypeProvider
                        for={editLabelColumns}
                        query={query}
                    />
                    <IntegratedPaging />
                    <Table columnExtensions={tableColumnExtensions} />
                    <TableHeaderRow />
                    <Toolbar />
                    <PagingPanel
                        pageSizes={pageSizes}
                    />
                </Grid>
            </div>
        );
    }
}

MilestonesList.propTypes = {
    classes: PropTypes.object.isRequired,
};


const mapState = state => ({
    milestones: state.milestonesView.milestones,
    query: state.milestonesView.query,
});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(MilestonesList));
