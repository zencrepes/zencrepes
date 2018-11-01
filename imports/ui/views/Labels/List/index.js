import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

import styles from '../../../styles.jsx';

import General from '../../../layouts/General/index.js';

import LabelsFetch from '../../../data/Labels/Fetch/index.js';

import LabelsTable from './LabelsTable.js';
import ButtonRefresh from './ButtonRefresh.js';

class LabelsList extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { updateLabels } = this.props;
        updateLabels();
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <General>
                    <ButtonRefresh />
                    <LabelsFetch loadModal={false} />
                    <LabelsTable />
                </General>
            </div>
        );
    }
}

LabelsList.propTypes = {
    classes: PropTypes.object,
};

const mapDispatch = dispatch => ({
    updateLabels: dispatch.labelsView.updateLabels,

});

export default connect(null, mapDispatch)(withRouter(withStyles(styles)(LabelsList)));
