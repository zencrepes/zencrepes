import React from 'react';

import Oops from './views/Oops/index.js';
import PropTypes from "prop-types";
import {connect} from "react-redux";

//https://reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        const { log } = this.props;
        // You can also log the error to an error reporting service
        log.error(error);
        log.info(info);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <Oops />;
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.object.isRequired,
    log: PropTypes.object.isRequired,
};

const mapState = state => ({
    log: state.global.log,
});

export default connect(mapState, null)(ErrorBoundary);
