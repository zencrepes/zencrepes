import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import green from "@material-ui/core/colors/green";
import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';
import red from "@material-ui/core/colors/red";
import CircularProgress from '@material-ui/core/CircularProgress';
import {connect} from "react-redux";

const styles = theme => ({
    root: {
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
    iconVerified: {
        margin: theme.spacing.unit,
        fontSize: 20,
        color: green[800],
    },
    iconError: {
        margin: theme.spacing.unit,
        fontSize: 20,
        color: red[800],
    },
    errorMessage: {
        fontSize: 10,
        color: red[800],
    },
    circularProgress: {
        color: '#6798e5',
        animationDuration: '550ms',
        left: 0,
    },
});

class VerifState extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, project, verifiedProjects } = this.props;
        const projectCheck = verifiedProjects.filter(ms => ms.id === project.id);
        if (projectCheck.length === 0) {
            return (
                <CircularProgress
                    variant="indeterminate"
                    className={classes.circularProgress}
                    size={20}
                    thickness={4}
                />
            );
        } else if (projectCheck.length === 1 && projectCheck[0].error === true) {
            return (
                <span className={classes.errorMessage} >
                    <ErrorIcon className={classes.iconError} /><br />
                    {projectCheck[0].errorMsg}
                </span>
            );
        } else if (projectCheck[0].error === false) {
            return (<CheckIcon className={classes.iconVerified} />);
        }
    }
}

VerifState.propTypes = {
    classes: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    verifiedProjects: PropTypes.array.isRequired,
};

const mapState = state => ({
    verifiedProjects: state.projectsEdit.verifiedProjects,
});

export default connect(mapState, null)(withStyles(styles)(VerifState));