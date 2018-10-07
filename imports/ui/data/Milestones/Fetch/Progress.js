import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
    root: {
    },
});
class Progress extends Component {
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
            <div className={classes.root}>
                <Snackbar
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    open={loading}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={
                        <div>
                            <span id="message-id">Things are loading, {loadedCount} Milestones modified</span>
                            <LinearProgress color="primary" variant="determinate" value={this.getProgressValue()} />
                        </div>
                    }
                />
            </div>
        );
    };
}

Progress.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    loading: state.githubFetchMilestones.loading,
    loadedCount: state.githubFetchMilestones.loadedCount,

    iterateTotal: state.githubFetchMilestones.iterateTotal,
    iterateCurrent: state.githubFetchMilestones.iterateCurrent,
});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Progress));
