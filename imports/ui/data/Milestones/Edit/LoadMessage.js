import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
    root: {
    },
});
class LoadMessage extends Component {
    constructor (props) {
        super(props);
    }

    getProgressValue = () => {
        const { iterateTotal, iterateCurrent } = this.props;
        return Math.round((iterateCurrent*100/iterateTotal),0);
    };

    render() {
        const { classes, loading, loadedCount } = this.props;

        return (
            <div>
                <span id="message-id">Things are loading, {loadedCount} Milestones modified</span>
                <LinearProgress color="primary" variant="determinate" value={this.getProgressValue()} />
            </div>
        );
    };
}

LoadMessage.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    loadedCount: state.milestonesEdit.loadedCount,

    iterateTotal: state.milestonesEdit.iterateTotal,
    iterateCurrent: state.milestonesEdit.iterateCurrent,
});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(LoadMessage));
