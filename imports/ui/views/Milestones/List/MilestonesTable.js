import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import SquareIcon from 'mdi-react/SquareIcon';
import PencilIcon from 'mdi-react/PencilIcon';
import EyeIcon from 'mdi-react/EyeIcon';

import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import CardBody from "../../../components/Card/CardBody";

import dashboardStyle from "../../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

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

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
});

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


const EditLabelFormatter = ({ value }) => {
    return <Link to={"/labels/view/" + value}><EyeIcon /></Link>;
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

    render() {
        const { classes, milestonesdata } = this.props;
        const { columns, pageSize, pageSizes, currentPage, statesColumns, reposColumns, issuesColumns, actionsColumns, editLabelColumns, tableColumnExtensions} = this.state;

        console.log(milestonesdata);

        return (
            <Card>
                <CardHeader color="success">
                    <h4 className={classes.cardTitleWhite}>Labels</h4>
                    <p className={classes.cardCategoryWhite}>
                        Milestones
                    </p>
                </CardHeader>
                <CardBody>
                    <Grid
                        rows={milestonesdata}
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
                </CardBody>
            </Card>
        );
    }
}

MilestonesTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});


const mapState = state => ({

});


export default connect(mapState, mapDispatch)(withStyles(dashboardStyle)(MilestonesTable));
