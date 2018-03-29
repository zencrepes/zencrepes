import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { gh_issues } from '../data_fetch/GhLoad.js'

import ReactTable from 'react-table'
import "react-table/react-table.css";

const columns = [{
    Header: 'Title',
    accessor: 'title'
//}, {
//    Header: 'Org',
//    accessor: 'org'
//}, {
//    Header: 'Repo',
//    accessor: 'repo'
}, {
    Header: 'State',
    accessor: 'state'
}]

class Table extends Component {
    render() {
        return (
            <ReactTable
                data={this.props.issues_list}
                columns={columns}
            />
        );
    }
}

export default withTracker(() => {
    return {
        issues_list: gh_issues.find({}).fetch(),
    };
})(Table);
