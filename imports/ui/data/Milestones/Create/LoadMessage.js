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
                <span id="message-id">Things are loading, {loadedCount} Milestones modified</span>
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
    loadedCount: state.milestonesCreate.loadedCount,

    iterateTotal: state.milestonesCreate.iterateTotal,
    iterateCurrent: state.milestonesCreate.iterateCurrent,
});

export default connect(mapState, null)(LoadMessage);
