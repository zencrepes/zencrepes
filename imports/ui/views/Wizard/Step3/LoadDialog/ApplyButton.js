import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import {connect} from "react-redux";

const styles = theme => ({
    root: {

    },
});

class ApplyButton extends Component {
    constructor (props) {
        super(props);
    }

    apply = () => {
        const { reposIssues, changeActiveStep, setLoadFlag, setLoadRepos  } = this.props;
        if (reposIssues === 0) {
            changeActiveStep(1);
        } else {
            setLoadRepos([]);
            setLoadFlag(true);
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={this.apply}
            >
                OK
            </Button>
        );
    }
}

ApplyButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    reposIssues: state.wizardView.reposIssues,
});

const mapDispatch = dispatch => ({
    changeActiveStep: dispatch.wizardView.changeActiveStep,

    setLoadFlag: dispatch.issuesFetch.setLoadFlag,
    setLoadRepos: dispatch.issuesFetch.setLoadRepos,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ApplyButton));