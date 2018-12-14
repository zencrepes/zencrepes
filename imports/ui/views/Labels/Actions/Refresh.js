import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";

const styles = theme => ({
    root: {
        textAlign: 'right'
    },
});

class Refresh extends Component {
    constructor (props) {
        super(props);
    }

    loadLabels = () => {
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    };

    render() {
        const { classes } = this.props;
        return (
            <Button variant="raised" color="primary" className={classes.button} onClick={this.loadLabels}>
                Load/Refresh Labels
            </Button>
        );
    };
}

Refresh.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Refresh);
