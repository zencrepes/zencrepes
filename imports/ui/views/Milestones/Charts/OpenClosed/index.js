import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import CustomCard from "../../../../components/CustomCard/index.js";

class OpenClosed extends Component {
    constructor (props) {
        super(props);
    }

    render() {
//        const { milestones } = this.props;
        return (
            <CustomCard
                headerTitle="Open vs Closed"
                headerFactTitle=""
                headerFactValue=""
            >
                <span>Some text</span>
            </CustomCard>
        );
    }
}

OpenClosed.propTypes = {
    milestones: PropTypes.array.isRequired,
};

const mapState = state => ({
    milestones: state.milestonesView.milestones,
});

export default withRouter(connect(mapState, null)(OpenClosed));