import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";

const styles = {
    root: {
        textAlign: 'right'
    },
};
class Notifications extends Component {
    constructor (props) {
        super(props);
        this.state = {
            showNotifications: false
        }
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.loading === true) { return false;}
        else {return true;}
    }

    componentDidUpdate(prevProps) {
        const { loading } = this.props;
        if (prevProps.loading === true && loading === false) {
            this.setState({ showNotifications: true });
            //Set timer to actually set back success to false (and remove snackbar)
            setTimeout(() => {
                this.setState({ showNotifications: false });
            }, 2000);
        }
    }

    render() {
        const { classes, loadingSuccessMsg} = this.props;
        const { showNotifications } = this.state;
        return (
            <div className={classes.root}>
                <Snackbar
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    open={showNotifications}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{loadingSuccessMsg}</span>}
                />
            </div>
        );
    }
}

Notifications.propTypes = {
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    loadingSuccess: PropTypes.bool.isRequired,
    loadingSuccessMsg: PropTypes.string,
};

const mapState = state => ({
    loading: state.loading.loading,
    loadingSuccess: state.loading.loadingSuccess,
    loadingSuccessMsg: state.loading.loadingSuccessMsg,
});

export default connect(mapState, null)(withStyles(styles)(Notifications));
