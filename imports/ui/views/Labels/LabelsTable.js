import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import SquareIcon from 'mdi-react/SquareIcon';

import EditIcon from '@material-ui/icons/Edit';

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
} from '@devexpress/dx-react-grid-material-ui';

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
    return <Link to={"/labels/edit/" + value + "/all"}><EditIcon /></Link>;
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

class LabelsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'edit', title: 'Edit', getCellValue: row => row.name },
                { name: 'name', title: 'Label' },
                { name: 'repos', title: 'In Repos', getCellValue: row => row.labels },
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
        const { columns, pageSize, pageSizes, currentPage, colorsColumns, descriptionsColumns, reposColumns, issuesColumns, editLabelColumns, tableColumnExtensions} = this.state;

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
                <PagingPanel
                    pageSizes={pageSizes}
                />
            </Grid>
        );
    }
}

LabelsTable.propTypes = {
    labels: PropTypes.array.isRequired,
};

export default LabelsTable;
