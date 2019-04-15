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
                headerTitle="OPEN issues, time since create"
                headerFactTitle=""
                headerFactValue=""
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
