import PropTypes from 'prop-types';

import React, { Component } from 'react';

import ResetGraph from "./ResetGraph.js";
import FetchMissing from "./FetchMissing.js";

class Controls extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { resetView } = this.props;

        return (
            <React.Fragment>
                <ResetGraph
                    resetView={resetView}
                />
                <FetchMissing />
            </React.Fragment>
        );
    }
}
Controls.propTypes = {
    resetView: PropTypes.func.isRequired,
};

export default Controls;

