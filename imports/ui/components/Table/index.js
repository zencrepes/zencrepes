import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { connect } from "react-redux";

import {
    // State or Local Processing Plugins
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow
} from '@devexpress/dx-react-grid-material-ui';

import { cfgIssues } from '../../data/Issues.js';

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
});

class IssuesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { name: 'state', title: 'State' },
                { name: 'title', title: 'Title' },
                { name: 'createdAt', title: 'Created At' },
                { name: 'closedAt', title: 'Closed At' }
            ]
        };
    }
/*
    getRows() {
        return cfgIssues.find({}).fetch();
    }
*/
    render() {
        const { classes, issuesLoading, filtersResults } = this.props;
        const { columns } = this.state;

        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardContent>
                        <Grid
                            rows={filtersResults}
                            columns={columns}
                        >
                            <Table />
                            <TableHeaderRow />
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

IssuesTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    issuesLoading: state.github.issuesLoading,
    filtersResults: state.data.results,
});


export default connect(mapState, null)(withStyles(styles)(IssuesTable));
