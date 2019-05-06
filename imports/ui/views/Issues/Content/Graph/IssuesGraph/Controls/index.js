import PropTypes from 'prop-types';

import React, { Component } from 'react';

import ResetGraph from "./ResetGraph.js";

class Controls extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { resetView } = this.props;

        return (
            <ResetGraph
                resetView={resetView}
            />
        );
    }
}
Controls.propTypes = {
    resetView: PropTypes.func.isRequired,
};

export default Controls;

