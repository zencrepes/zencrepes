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
            <div>
                <span id="message-id">Things are loading, {loadedCount} Issues loaded</span>
                <LinearProgress color="primary" variant="determinate" value={this.getProgressValue()} />
            </div>
        );
    }
}

LoadMessage.propTypes = {
    loadedCount: PropTypes.number,
    iterateTotal: PropTypes.number,
    iterateCurrent: PropTypes.number,
};

const mapState = state => ({
    loadedCount: state.issuesFetch.loadedCount,

    iterateTotal: state.issuesFetch.iterateTotal,
    iterateCurrent: state.issuesFetch.iterateCurrent,
});

export default connect(mapState, null)(LoadMessage);
