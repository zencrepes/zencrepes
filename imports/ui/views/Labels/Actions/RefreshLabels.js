import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";

import RefreshIcon from '@material-ui/icons/Refresh';

const styles = theme => ({
    root: {
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
});
class RefreshLabels extends Component {
    constructor (props) {
        super(props);
    }

    refreshFull = () => {
        const { setStageFlag, setVerifFlag, setLabels, setAction, labels, setOnSuccess, updateView, setVerifying } = this.props;
        setLabels(labels);
        setAction('refresh');
        setVerifying(true);
        setOnSuccess(updateView);
        setVerifFlag(true);
    };

    render() {
        const { classes } = this.props;

        return (
            <Button variant="contained" color="primary" className={classes.button} onClick={this.refreshFull}>
                <RefreshIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Labels
            </Button>
        )
    };
}

RefreshLabels.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    labels: state.labelsView.labels,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.labelsEdit.setStageFlag,
    setVerifFlag: dispatch.labelsEdit.setVerifFlag,
    setVerifying: dispatch.labelsEdit.setVerifying,

    setLabels: dispatch.labelsEdit.setLabels,
    setAction: dispatch.labelsEdit.setAction,
    setOnSuccess: dispatch.labelsEdit.setOnSuccess,

    updateView: dispatch.labelsView.updateView,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(RefreshLabels));
