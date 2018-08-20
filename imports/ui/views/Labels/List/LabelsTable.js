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

const ColorsFormatter = ({ value }) => {
    return value.map(color => (
        <SquareIcon key={color.name} color={color.name} />
    ))
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

const DescriptionsTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={DescriptionsFormatter}
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

const EditLabelFormatter = ({ value }) => {
    return <Link to={"/labels/view/" + value}><EyeIcon /></Link>;
};

const EditLabelTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={EditLabelFormatter}
        {...props}
    />
);

class LabelsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'edit', title: 'Edit', getCellValue: row => row.name },
                { name: 'name', title: 'Label' },
                { name: 'repos', title: 'Repos Count', getCellValue: row => row.labels },
                { name: 'issues', title: 'Issues Count', getCellValue: row => row.labels },
                { name: 'colors', title: 'Colors' },
                { name: 'descriptions', title: 'Description' },
            ],
            tableColumnExtensions: [
                { columnName: 'edit', width: 60 },
                { columnName: 'name', width: 200 },
                { columnName: 'repos', width: 150 },
                { columnName: 'issues', width: 90 },
                { columnName: 'colors', width: 150 },
            ],
            colorsColumns: ['colors'],
            descriptionsColumns: ['descriptions'],
            reposColumns: ['repos'],
            issuesColumns: ['issues'],
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
        const { classes, labelsdata } = this.props;
        const { columns, pageSize, pageSizes, currentPage, colorsColumns, descriptionsColumns, reposColumns, issuesColumns, editLabelColumns, tableColumnExtensions} = this.state;

        return (
            <Card>
                <CardHeader color="success">
                    <h4 className={classes.cardTitleWhite}>Labels</h4>
                    <p className={classes.cardCategoryWhite}>
                        Grouped by labels over all repositories
                    </p>
                </CardHeader>
                <CardBody>
                    <Grid
                        rows={labelsdata}
                        columns={columns}
                    >
                        <PagingState
                            currentPage={currentPage}
                            onCurrentPageChange={this.changeCurrentPage}
                            pageSize={pageSize}
                            onPageSizeChange={this.changePageSize}
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

LabelsTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});


const mapState = state => ({

});


export default connect(mapState, mapDispatch)(withStyles(dashboardStyle)(LabelsTable));
