import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";

import LinearProgress from '@material-ui/core/LinearProgress';

class LoadMessage extends Component {
    constructor (props) {
        super(props);
    }

    getProgressValue = () => {
        const { iterateTotal, iterateCurrent } = this.props;
        return Math.round((iterateCurrent*100/iterateTotal),0);
    };

    render() {
        const { loadedCount } = this.props;

        return (
            <React.Fragment>
                <span id="message-id">Loading, {loadedCount} Labels found</span>
                <LinearProgress color="primary" variant="determinate" value={this.getProgressValue()} />
            </React.Fragment>
        );
    }
}

LoadMessage.propTypes = {
    loadedCount: PropTypes.number.isRequired,
    iterateTotal: PropTypes.number.isRequired,
    iterateCurrent: PropTypes.number.isRequired,
};

const mapState = state => ({
    loadedCount: state.labelsFetch.loadedCount,

    iterateTotal: state.labelsFetch.iterateTotal,
    iterateCurrent: state.labelsFetch.iterateCurrent,
});

export default connect(mapState, null)(LoadMessage);
