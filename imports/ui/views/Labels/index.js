import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

import styles from '../../styles.jsx';

import General from '../../layouts/General/index.js';

import LabelsFetch from '../../data/Labels/Fetch/index.js';

import LabelsTable from './LabelsTable.js';
import Actions from "./Actions/index.js";

class Labels extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { updateLabels } = this.props;
        updateLabels();
    };

    render() {
        const { classes, labels } = this.props;

        return (
            <div className={classes.root}>
                <General>
                    <Actions />
                    <LabelsFetch loadModal={false} />
                    <LabelsTable labels={labels}/>
                </General>
            </div>
        );
    }
}

Labels.propTypes = {
    classes: PropTypes.object,
};

const mapDispatch = dispatch => ({
    updateLabels: dispatch.labelsView.updateLabels,
});

const mapState = state => ({
    labels: state.labelsView.labels,
});

export default connect(mapState, mapDispatch)(withRouter(withStyles(styles)(Labels)));
