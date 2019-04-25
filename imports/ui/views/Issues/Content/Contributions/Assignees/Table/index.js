import React, { Component } from 'react';
import PropTypes from "prop-types";

import ReactTable from "react-table";
import "react-table/react-table.css";

class ContributionsTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            columns: [],
        }
    }

    static getDerivedStateFromProps(nextProps) {
        const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

        let metric = 'points';
        if (!nextProps.defaultPoints) {metric = 'issues';}
        let columns = [{
            Header: 'Assignee',
            accessor: 'assignee',
            filterable: true,
            maxWidth: 150,
        }, {
            Header: 'Type',
            accessor: 'type',
            filterable: true,
            width: 80
        }, {
            Header: 'Name',
            accessor: 'name',
            filterable: true,
            maxWidth: 150,
        }];
        if (metric === 'points') {
            columns.push({
                Header: 'Issues',
                accessor: 'issues_count',
                width: 55
            });
        } else {
            columns.push({
                Header: 'Points',
                accessor: 'points_count',
                width: 55
            });
        }
        columns.push({
            Header: 'Effort',
            columns: [{
                Header: metric.charAt(0).toUpperCase() + metric.slice(1),
                accessor: 'effort_count',
                width: 55,
            }, {
                Header: '%',
                accessor: 'effort_prct',
                width: 35
            }]
        });

        let dateColumns = {};
        if (nextProps.contributions[0] !== undefined) {
            nextProps.contributions[0].dates.forEach((date) => {
                if (dateColumns[date.date.slice(5, 7)] === undefined) {
                    dateColumns[date.date.slice(5, 7)] = {
                        Header: months[parseInt(date.date.slice(5, 7))-1],
                        columns: []
                    }
                }
                dateColumns[date.date.slice(5, 7)].columns.push({
                    Header: date.date.slice(8, 10),
                    width: 28,
                    accessor: date.date.slice(5, 10),
                    Cell: row => {
                        if (row.value[metric] === 0) {
                            return null;
                        } else {
                            return (<span>{row.value[metric]}</span>);
                        }
                    }
                });
            });
        }
        columns = [...columns, ...Object.values(dateColumns)];
        return {columns}
    }

    clickIssues = (issues) => {
        const { setUpdateQueryPath, setUpdateQuery } = this.props;
        const issuesArrayQuery = issues.map(issue => issue.id);
        const query = {'id': {'$in': issuesArrayQuery}};
        setUpdateQuery(query);
        setUpdateQueryPath('/issues/list');
    };

    //From: https://github.com/tannerlinsley/react-table/issues/335
    filterCaseInsensitive = (filter, row) => {
        const id = filter.pivotId || filter.id;
        if (row[id] !== null && typeof row[id] === 'string') {
            return (
                row[id] !== undefined ?
                    String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase()) : true
            )
        }
        else {
            return (
                String(row[filter.id]) === filter.value
            )
        }
    };

    render() {
        const { contributions } = this.props;
        const {
            columns,
        } = this.state;
        return (
            <ReactTable
                data={contributions}
                columns={columns}
                noDataText="No data available!"
                className="-striped -highlight"
                defaultPageSize={50}
                pageSizeOptions={[25, 50, 100, 200]}
                defaultFilterMethod={this.filterCaseInsensitive}
                filterable={false}
                getTdProps={(state, rowInfo, column) => {
                    return {
                        onClick: (e, handleOriginal) => {
                            if (rowInfo.row[column.id].list !== undefined && rowInfo.row[column.id].list.length > 0) {
                                this.clickIssues(rowInfo.row[column.id].list);
                            } else if (rowInfo.row._original.list !== undefined && rowInfo.row._original.list.length > 0) {
                                this.clickIssues(rowInfo.row._original.list);
                            }
                            // IMPORTANT! React-Table uses onClick internally to trigger
                            // events like expanding SubComponents and pivots.
                            // By default a custom 'onClick' handler will override this functionality.
                            // If you want to fire the original onClick handler, call the
                            // 'handleOriginal' function.
                            if (handleOriginal) {
                                handleOriginal()
                            }
                        }
                    }
                }}
            />
        );
    }
}

ContributionsTable.propTypes = {
    contributions: PropTypes.array.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
    setUpdateQueryPath: PropTypes.func.isRequired,
    setUpdateQuery: PropTypes.func.isRequired,
};

export default ContributionsTable;

