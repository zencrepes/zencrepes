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

import dashboardStyle from "../../../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import Card from "../../../../components/Card/Card";
import CardHeader from "../../../../components/Card/CardHeader";
import CardBody from "../../../../components/Card/CardBody";

import LabelColor from './Color.js';
import LabelName from './Name.js';
import LabelDescription from './Description.js';
import DeleteWarning from './DeleteWarning.js';

class EditActions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteWarning: false,
        };
    }

    clickSaveLabels() {
        console.log('clickSaveLabels');
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
            <Card>
                <CardHeader color="success">
                    <h4 className={classes.cardTitleWhite}>Actions</h4>
                    <p className={classes.cardCategoryWhite}>
                        Apply the following actions to all selected repositories
                    </p>
                </CardHeader>
                <CardBody >
                    <DeleteWarning />
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
                </CardBody>
            </Card>
        );
    }
}

EditActions.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
    //saveLabels: dispatch.labelsEdit.saveLabels
    setLoadFlag: dispatch.labelsEdit.setLoadFlag,
    setDeleteWarning: dispatch.labelsEdit.setDeleteWarning,
    setAction: dispatch.labelsEdit.setAction

});

export default connect(mapState, mapDispatch)(withStyles(dashboardStyle)(EditActions));