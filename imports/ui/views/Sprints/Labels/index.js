import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import PropTypes from "prop-types";

import CustomCard from "../../../components/CustomCard/index.js";
import LabelsTable from './LabelsTable.js';

const styles = theme => ({
    root: {
    }
});

class Labels extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, labels } = this.props;
        return (
            <CustomCard
                headerTitle="Labels"
                headerFactTitle="Count"
                headerFactValue={labels.length}
            >
                <LabelsTable labels={labels} />
            </CustomCard>
        );
    }
}

Labels.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    labels: state.sprintsView.labels,
});

export default connect(mapState, null)(withStyles(styles)(Labels));
