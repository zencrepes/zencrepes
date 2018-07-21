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

import LabelColor from './Color.js';
import LabelName from './Name.js';
import LabelDescription from './Description.js';

const styles = theme => ({

});

class EditActions extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    clickSaveLabels() {
        const { setLoadFlag } = this.props;
        setLoadFlag(true);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
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
    setLoadFlag: dispatch.labelsconfiguration.setLoadFlag
});

export default connect(mapState, mapDispatch)(withStyles(styles)(EditActions));