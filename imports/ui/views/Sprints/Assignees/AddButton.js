import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';

const styles = {
    root: {
        textAlign: 'right'
    },
};
class AddButton extends Component {
    constructor (props) {
        super(props);
    }

    addClick = () => {
        console.log('addClick');
        const { setOpenAddAssignee } = this.props;
        setOpenAddAssignee(true);
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Button variant="contained" color="primary" size="small" onClick={this.addClick}>
                    Add
                </Button>
            </div>
        )
    }
}

AddButton.propTypes = {
    classes: PropTypes.object.isRequired,
    setOpenAddAssignee: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setOpenAddAssignee: dispatch.sprintsView.setOpenAddAssignee,
});

export default connect(null, mapDispatch)(withStyles(styles)(AddButton));
