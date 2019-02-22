import React, { Component } from 'react';
import PropTypes from "prop-types";

class List extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { provided, innerRef, children } = this.props;
        return (
            <div {...provided.droppableProps} ref={innerRef}>
                {children}
            </div>
        );
    }
}

List.propTypes = {
    provided: PropTypes.object.isRequired,
    innerRef: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
};

export default List;
