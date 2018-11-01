import _ from 'lodash';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter, Link } from 'react-router-dom';
import PropTypes from "prop-types";

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import styles from '../../../styles.jsx';

import General from '../../../layouts/General/index.js';

import SelectedColors from './Stats/SelectedColors.js';
import SelectedDescriptions from './Stats/SelectedDescriptions.js';
import EditSelection from './Selection/index.js';
import EditActions from './Actions/index.js';

import LabelsEdit from '../../../data/Labels/Edit/index.js';

class LabelEdit extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('componentDidMount');
        const { initConfiguration } = this.props;
        let labelName = this.props.match.params.name;
        initConfiguration(labelName)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('Sprint Planning - componentDidUpdate');
        const { initConfiguration, loadSuccess } = this.props;
        if (prevProps.loadSuccess === false && loadSuccess === true) {
            let labelName = this.props.match.params.name;
            initConfiguration(labelName)
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <General>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        <Grid item xs={12} sm={6} md={4}>
                            <SelectedColors />
                        </Grid>
                        <Grid item xs={12} sm={6} md={8}>
                            <SelectedDescriptions />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <EditSelection />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <EditActions />
                        </Grid>
                    </Grid>
                </General>
            </div>
        );
    }
}

LabelEdit.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    loadSuccess: state.labelsEdit.loadSuccess,
});

const mapDispatch = dispatch => ({
    initConfiguration: dispatch.labelsEdit.initConfiguration,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(LabelEdit));
