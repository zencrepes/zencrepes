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

class AsisgneesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'login', title: 'User' },
                { name: 'count', title: 'Issues'},
            ],
            tableColumnExtensions: [
                { columnName: 'count', width: 90 },
            ]
        };
    }

    render() {
        const { classes, assignees } = this.props;
        const { columns, tableColumnExtensions} = this.state;

        return (
            <div className={classes.root}>
                <Grid
                    rows={assignees}
                    columns={columns}
                >
                    <Table columnExtensions={tableColumnExtensions} />
                    <TableHeaderRow />
                </Grid>
            </div>
        );
    }
}

AsisgneesTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});


const mapState = state => ({

});


export default connect(mapState, mapDispatch)(withStyles(styles)(AsisgneesTable));
