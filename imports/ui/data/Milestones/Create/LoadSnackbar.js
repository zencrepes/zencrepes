import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";

import LoadMessage from './LoadMessage.js';

const styles = theme => ({
    root: {
    },
});
class LoadSnackbar extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, loading } = this.props;

        return (
            <div className={classes.root}>
                <Snackbar
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    open={loading}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<LoadMessage />}
                />
            </div>
        );
    };
}

LoadSnackbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    loading: state.milestonesCreate.loading,
});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(LoadSnackbar));
