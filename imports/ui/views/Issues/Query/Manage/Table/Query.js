import React, { Component } from 'react';

import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Delete from './Delete.js';
import Open from './Open.js';

import Filters from '../../Filters/index.js';

class Query extends Component {
    constructor (props) {
        super(props);
    }

    openQuery = () => {
        const { query, loadQuery } = this.props;
        loadQuery(query);
    };

    deleteQuery = () => {
        const { query, deleteQuery } = this.props;
        deleteQuery(query);
    };

    render() {
        const { query, facets, timeFields } = this.props;

        return (
            <TableRow>
                <TableCell padding="none"><Open onClick={this.openQuery} /></TableCell>
                <TableCell scope="row">
                    {query.name}
                </TableCell>
                <TableCell>
                    <Filters
                        query={JSON.parse(query.filters)}
                        timeFields={timeFields}
                        facets={facets}
                        updateQuery={null}
                        updateQueryDate={null}
                    />
                </TableCell>
                <TableCell padding="none"><Delete onClick={this.deleteQuery} /></TableCell>
            </TableRow>
        );
    }
}

Query.propTypes = {
    query: PropTypes.object.isRequired,
    facets: PropTypes.array.isRequired,
    timeFields: PropTypes.array.isRequired,
    deleteQuery: PropTypes.func.isRequired,
    loadQuery: PropTypes.func.isRequired,
};

export default Query;
