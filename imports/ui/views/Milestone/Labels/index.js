import React, { Component } from 'react';
import { connect } from "react-redux";

import PropTypes from "prop-types";

import CustomCard from "../../../components/CustomCard/index.js";
import LabelsTable from './LabelsTable.js';

class Labels extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { labels } = this.props;
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
    labels: PropTypes.array.isRequired,
};

const mapState = state => ({
    labels: state.milestoneView.labels,
});

export default connect(mapState, null)(Labels);
