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

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import LabelColor from './Color.js';
import LabelName from './Name.js';
import LabelDescription from './Description.js';

const styles = theme => ({
    button: {

    },
});

class DeleteWarning extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    triggerLabelsDeletion = () => {
        const { setDeleteWarning, setAction, setLoadFlag } = this.props;
        setDeleteWarning(false);
        setAction('delete');
        setLoadFlag(true);
    };

    cancelLabelsDeletion = () => {
        const { setDeleteWarning } = this.props;
        setDeleteWarning(false);

    };

    render() {
        const { classes, deleteWarning } = this.props;
        console.log(deleteWarning);

        if (deleteWarning) {
            return (
                <div>
                    <Dialog
                        open={deleteWarning}
                        onClose={this.cancelLabelsDeletion}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Delete Labels"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                You are about to request one or more labels to be delete from Github. Deleting a label will remove it from all issues and pull requests. <br />
                                This cannot be undone !
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.cancelLabelsDeletion} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.triggerLabelsDeletion} color="primary" autoFocus>
                                YES, Delete !
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        } else {
            return null;
        }

    }
}

DeleteWarning.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({
    deleteWarning: state.labelsconfiguration.deleteWarning

});

const mapDispatch = dispatch => ({
    setDeleteWarning: dispatch.labelsconfiguration.setDeleteWarning,
    setLoadFlag: dispatch.labelsconfiguration.setLoadFlag,
    setAction: dispatch.labelsconfiguration.setAction,

});

export default connect(mapState, mapDispatch)(withStyles(styles)(DeleteWarning));