import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";

import LoadMessage from './LoadMessage.js';

class LoadSnackbar extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { loading } = this.props;

        return (
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={loading}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<LoadMessage />}
            />
        );
    }
}

LoadSnackbar.propTypes = {
    loading: PropTypes.bool.isRequired,
};

const mapState = state => ({
    loading: state.milestonesFetch.loading,
});

export default connect(mapState, null)(LoadSnackbar);
