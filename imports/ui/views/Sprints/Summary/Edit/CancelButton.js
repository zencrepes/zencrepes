import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
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

    cancel = () => {
        const { setEditSprint } = this.props;
        setEditSprint(false);
    };

    render() {
        const { classes } = this.props;

        //The apply button is disabled until all milestones have been verified in GitHub and no errors have been found
        return (
            <Button onClick={this.cancel} color="primary" autoFocus>
                Cancel
            </Button>
        );
    }
}

ApplyButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
    setEditSprint: dispatch.sprintsView.setEditSprint,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ApplyButton));