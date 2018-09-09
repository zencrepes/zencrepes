import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import SquareIcon from 'mdi-react/SquareIcon';
import PencilIcon from 'mdi-react/PencilIcon';
import { GithubCircle } from 'mdi-material-ui'

import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import CardBody from "../../../components/Card/CardBody";

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

import dashboardStyle from "../../../assets/jss/material-dashboard-react/views/dashboardStyle";

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
    return <div><SquareIcon color={value} />{value}</div>
};

const ColorsTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={ColorsFormatter}
        {...props}
    />
);

const DescriptionsFormatter = ({ value }) => {
    if (value === undefined) {return '';}
    else {return value;}
};

const DescriptionsTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={DescriptionsFormatter}
        {...props}
    />
);

const LinkFormatter = ({ value }) => {
    return (
        <Link to={value}>
            <GithubCircle />
        </Link>
    )
};

const LinkTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={LinkFormatter}
        {...props}
    />
);

const EditLabelFormatter = (value) => {
    return <Link to={"/labels/edit/" + value.row.name + "/" + value.row.id}><PencilIcon /></Link>;
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
                //{ name: 'edit', title: 'Edit', getCellValue: row => row.name },
                { name: 'edit', title: 'Edit', getCellValue: row => row.name },
                { name: 'org', title: 'Org', getCellValue: row => row.repo.org.login},
                { name: 'repo', title: 'Repo', getCellValue: row => row.repo.name},
                { name: 'issues', title: 'Issues Count', getCellValue: row => row.issues.totalCount},
                { name: 'color', title: 'Color', getCellValue: row => '#' + row.color},
                { name: 'description', title: 'Description' },
                { name: 'url', title: '' },
            ],
            tableColumnExtensions: [
                { columnName: 'edit', width: 60 },
                { columnName: 'repo', width: 150 },
                { columnName: 'org', width: 150 },
                { columnName: 'color', width: 150 },
                { columnName: 'issues', width: 90 },
                { columnName: 'url', width: 40 },
            ],
            colorsColumns: ['color'],
            descriptionsColumns: ['description'],
            linkColumns: ['url'],
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
        const { columns, pageSize, pageSizes, currentPage, editLabelColumns, colorsColumns, descriptionsColumns, linkColumns, tableColumnExtensions} = this.state;

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
                        <LinkTypeProvider
                            for={linkColumns}
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
