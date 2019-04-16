import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import StatsBinBar from '../../../../../components/Charts/StatsBinBar.js';

class BinsCreatedSince extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { statsBins } = this.props;
        return (
            <CustomCard
                headerTitle="Issues still open after"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Issues with an OPEN state, amount of time since they were created."
            >
                <StatsBinBar
                    dataset={statsBins}
                />
            </CustomCard>
        );
    }
}

BinsCreatedSince.propTypes = {
    statsBins: PropTypes.array.isRequired,
};

export default BinsCreatedSince;
