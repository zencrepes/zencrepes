import React, { Component } from 'react';
import PropTypes from "prop-types";

import ColumnItem from './columnItem.js';

class Column extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { column, children } = this.props;
        return (
            <ColumnItem column={column}>
                {children}
            </ColumnItem>
        );
    }
}

Column.propTypes = {
    column: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
};

export default Column;
