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
                <span id="message-id">Fetching from GitHub, {loadedCount} Milestones</span>
                <LinearProgress color="primary" variant="determinate" value={this.getProgressValue()} />
            </React.Fragment>
        );
    }
}

LoadMessage.propTypes = {
    classes: PropTypes.object.isRequired,

    iterateTotal: PropTypes.object.isRequired,
    iterateCurrent: PropTypes.object.isRequired,
    loadedCount: PropTypes.object.isRequired,
};

const mapState = state => ({
    loadedCount: state.milestonesFetch.loadedCount,

    iterateTotal: state.milestonesFetch.iterateTotal,
    iterateCurrent: state.milestonesFetch.iterateCurrent,
});

export default connect(mapState, null)(LoadMessage);
