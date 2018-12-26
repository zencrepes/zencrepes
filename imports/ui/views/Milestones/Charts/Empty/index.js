import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import CustomCard from "../../../../components/CustomCard/index.js";
import {withRouter} from "react-router-dom";

import CloseEmptyButton from './CloseEmptyButton.js';

class Empty extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { milestones } = this.props;
        return (
            <CustomCard
                headerTitle="Closed but Empty"
                headerFactTitle="Count"
                headerFactValue={milestones.filter(m => m.state.toLowerCase() === 'closed').filter(milestone => milestone.issues.totalCount === 0).length}
            >
                <CloseEmptyButton />
            </CustomCard>
        );
    }
}

Empty.propTypes = {
    milestones: PropTypes.array.isRequired,
};

const mapState = state => ({
    milestones: state.milestonesView.milestones,
});

export default withRouter(connect(mapState, null)(Empty));