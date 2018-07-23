import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import classNames from 'classnames';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core/Dialog';


import LabelColor from './Color.js';
import LabelName from './Name.js';
import LabelDescription from './Description.js';
import DeleteWarning from './DeleteWarning.js';

const styles = theme => ({

});

class EditActions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteWarning: false,
        };
    }

    clickSaveLabels() {
        const { setLoadFlag, setAction } = this.props;
        setLoadFlag(true);
        setAction('update');
    };

    clickDeleteLabels() {
        console.log('clickDeleteLabels');
        const { setDeleteWarning } = this.props;
        setDeleteWarning(true);
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <DeleteWarning />
                <h2>Actions</h2>
                <List component="nav">
                    <LabelName />
                    <Divider />
                    <LabelColor />
                    <Divider />
                    <LabelDescription />
                    <Divider />
                    <Button variant="outlined" color="primary" className={classes.button} onClick={() => this.clickSaveLabels()}>
                        Save
                    </Button>
                    <Button variant="outlined" color="primary" className={classes.button} onClick={() => this.clickDeleteLabels()}>
                        Delete Label
                    </Button>
                </List>
            </div>
        );
    }
}

EditActions.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
    //saveLabels: dispatch.labelsconfiguration.saveLabels
    setLoadFlag: dispatch.labelsconfiguration.setLoadFlag,
    setDeleteWarning: dispatch.labelsconfiguration.setDeleteWarning,
    setAction: dispatch.labelsconfiguration.setAction

});

export default connect(mapState, mapDispatch)(withStyles(styles)(EditActions));