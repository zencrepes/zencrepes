import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";

const styles = theme => ({
    root: {
    },
});
class Progress extends Component {
    constructor (props) {
        super(props);
    }

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
                    message={<span id="message-id">Things are loading, {loadedCount} Milestones modified</span>}
                />
            </div>
        );
    };
}

Progress.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    loading: state.githubCreateMilestones.loading,
    loadedCount: state.githubCreateMilestones.loadedCount,
});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Progress));
