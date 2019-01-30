import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";

import LinearProgress from '@material-ui/core/LinearProgress';

class LoadMessage extends Component {
    constructor (props) {
        super(props);
    }

    getProgressValue = () => {
        const { loadingIterateTotal, loadingIterateCurrent } = this.props;
        return Math.round((loadingIterateCurrent*100/loadingIterateTotal),0);
    };

    render() {
        const { loadingMsg, loadingMsgAlt } = this.props;
        return (
            <React.Fragment>
                <span id="message-id">{loadingMsg}</span>
                <LinearProgress color="primary" variant="determinate" value={this.getProgressValue()} />
                <span id="message-id">{loadingMsgAlt}</span>
            </React.Fragment>
        );
    }
}

LoadMessage.propTypes = {
    loadingMsg: PropTypes.string,
    loadingMsgAlt: PropTypes.string,
    loadingIterateCurrent: PropTypes.number.isRequired,
    loadingIterateTotal: PropTypes.number.isRequired,
};

const mapState = state => ({
    loadingMsg: state.global.loadingMsg,
    loadingMsgAlt: state.global.loadingMsgAlt,
    loadingIterateCurrent: state.global.loadingIterateCurrent,
    loadingIterateTotal: state.global.loadingIterateTotal,
});

export default connect(mapState, null)(LoadMessage);
