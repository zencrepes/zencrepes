import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import classNames from 'classnames';

import Button from '@material-ui/core/Button';

import RefreshIcon from '@material-ui/icons/Refresh';

const styles = theme => ({
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
        const { setVerifFlag, setLabels, setAction, labels, setOnSuccess, updateView, setVerifying } = this.props;
        setLabels(labels);
        setAction('refresh');
        setVerifying(true);
        setOnSuccess(updateView);
        setVerifFlag(true);
    };

    render() {
        const { classes } = this.props;

        return (
            <Button variant="contained" color="primary" onClick={this.refreshFull}>
                <RefreshIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Labels
            </Button>
        )
    }
}

RefreshLabels.propTypes = {
    classes: PropTypes.object.isRequired,

    labels: PropTypes.array.isRequired,

    setVerifFlag: PropTypes.func.isRequired,
    setVerifying: PropTypes.func.isRequired,
    setLabels: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    labels: state.labelsView.labels,
});

const mapDispatch = dispatch => ({
    setVerifFlag: dispatch.labelsEdit.setVerifFlag,
    setVerifying: dispatch.labelsEdit.setVerifying,

    setLabels: dispatch.labelsEdit.setLabels,
    setAction: dispatch.labelsEdit.setAction,
    setOnSuccess: dispatch.labelsEdit.setOnSuccess,

    updateView: dispatch.labelsView.updateView,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(RefreshLabels));
