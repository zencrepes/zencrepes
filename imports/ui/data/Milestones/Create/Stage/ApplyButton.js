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
        const { setLoadFlag, setStageFlag, repos } = this.props;
        console.log(repos);
        setStageFlag(false);
        setLoadFlag(true);
    };

    render() {
        const { classes, verifiedRepos, repos } = this.props;

        //The apply button is disabled until all milestones have been verified in GitHub and no errors have been found
        return (
            <Button
                variant="contained"
                color="primary"
                disabled={verifiedRepos.filter(repo => repo.error === false).length !== repos.length}
                className={classes.button}
                onClick={this.apply}
            >
                Apply
            </Button>
        );
    }
}

ApplyButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    verifiedRepos: state.milestonesCreate.verifiedRepos,
    repos: state.milestonesCreate.repos,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.milestonesCreate.setLoadFlag,
    setStageFlag: dispatch.milestonesCreate.setStageFlag,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ApplyButton));