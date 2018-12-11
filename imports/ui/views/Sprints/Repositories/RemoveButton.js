import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {connect} from "react-redux";

const styles = theme => ({
    root: {
    },
});

class RemoveButton extends Component {
    constructor (props) {
        super(props);
    }

    remove = () => {
        const { repo } = this.props;
        console.log(repo);
    };

    render() {
        const { classes } = this.props;
        return (
            <IconButton aria-label="Delete" className={classes.margin} onClick={this.remove}>
                <DeleteIcon fontSize="small" />
            </IconButton>
        );
    }
}

RemoveButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    verifiedRepos: state.milestonesCreate.verifiedRepos,
    repos: state.milestonesCreate.repos,
});

const mapDispatch = dispatch => ({
    setRepos: dispatch.milestonesCreate.setRepos,
    setVerifiedRepos: dispatch.milestonesCreate.setVerifiedRepos,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(RemoveButton));
