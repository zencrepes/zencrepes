import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";

import {buildMongoSelector} from "../../../utils/mongo";
import {cfgIssues} from "../../../data/Minimongo";

const styles = theme => ({
    root: {
        textAlign: 'right'
    },
});
class AddButton extends Component {
    constructor (props) {
        super(props);
    }

    addClick = () => {
        console.log('addClick');
        const { setOpenAddAssignee } = this.props;
        setOpenAddAssignee(true);
        /*
        const { setLoadFlag } = this.props;
        setLoadFlag({
            issues: 'true',
            labels: 'false'
        });
        */
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Button variant="contained" color="primary" size="small" className={classes.button} onClick={this.addClick}>
                    Add
                </Button>
            </div>
        )
    };
}

AddButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
    setOpenAddAssignee: dispatch.sprintsView.setOpenAddAssignee,

});


export default connect(mapState, mapDispatch)(withStyles(styles)(AddButton));
