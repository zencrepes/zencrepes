import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';

import { cfgQueries } from '../../../data/Queries.js';
import { cfgIssues } from '../../../data/Issues.js';

const styles = theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        //width: 700,
    },
    row: {
        height: 24,
    },
});

class IssuesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                {headerName: "Title", field: "title"},
            ],
        };
    }

    /*
     * buildQuery() - Build the query from a filter
     */
    buildQuery = (mongoFilter) => {
        console.log('buildQuery - Source: ' + JSON.stringify(mongoFilter));
        let updatedFilter = mongoFilter;
        //{"state":{"$in":["OPEN"]},"milestone.state":{"$in":["CLOSED"]}}
        if (updatedFilter['state'] !== undefined) {
            delete updatedFilter['state'];
        }
        if (updatedFilter['milestone.state'] !== undefined) {
            delete updatedFilter['milestone.state'];
        }
        updatedFilter['state'] = {$in:['OPEN']};
        updatedFilter['milestone.state'] = {$in:['OPEN']};
        console.log('buildQuery - Updated: ' + JSON.stringify(updatedFilter));
        return updatedFilter;
    };

    getTableData = (mongoFilter) => {
        console.log('getTableData: ' + JSON.stringify(mongoFilter));
        return cfgIssues.find(mongoFilter).fetch();
    }

    render() {
        const { classes, mongoFilter } = this.props;
        const { columnDefs } = this.state;

        let updatedFilter = this.buildQuery(mongoFilter);
        console.log('Render using: ' + JSON.stringify(updatedFilter));
        let tableData = this.getTableData(updatedFilter);

        return (
            <div className={classes.root}>
                <div className="ag-theme-balham"
                     style={{
                         height: '200px',
                         width: '100%' }}
                >
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={tableData}>
                    </AgGridReact>
                </div>
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
