import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { connect } from "react-redux";
import { GithubCircle } from 'mdi-material-ui'
import { Link } from 'react-router-dom';

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
    },
});

const LinkFormatter = ({ value }) => {
    return (
        <a href={value}>
            <GithubCircle />
        </a>
    )
}

const LinkTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={LinkFormatter}
        {...props}
    />
);

const AssigneesFormatter = ({ value }) => {
    if (value.totalCount > 0) {
        return Array.prototype.map.call(value.edges, s => {
            if (s.node.name === null) {
                return s.node.login;
            } else {
                return s.node.name;
            }
        }).toString()
    } else {
        return '-';
    }
};

const AssigneesTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={AssigneesFormatter}
        {...props}
    />
);

class IssuesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'title', title: 'Title' },
                { name: 'assignees', title: 'Assignees' },
                { name: 'points', title: 'Points' },
                { name: 'state', title: 'State' },
                { name: 'url', title: '' },
            ],
            tableColumnExtensions: [
                { columnName: 'assignees', width: 150 },
                { columnName: 'points', width: 60 },
                { columnName: 'state', width: 70 },
                { columnName: 'url', width: 40 },
            ],
            linkColumns: ['url'],
            assigneesColumns: ['assignees'],

        };
    }

    render() {
        const { classes, issues } = this.props;
        const { columns, linkColumns, assigneesColumns, tableColumnExtensions} = this.state;

        console.log(issues);

        return (
            <div className={classes.root}>
                <Grid
                    rows={issues}
                    columns={columns}
                >
                    <AssigneesTypeProvider
                        for={assigneesColumns}
                    />
                    <LinkTypeProvider
                        for={linkColumns}
                    />
                    <Table columnExtensions={tableColumnExtensions} />
                    <TableHeaderRow />
                </Grid>
            </div>
        );
    }
}

IssuesTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});


const mapState = state => ({

});


export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesTable));
