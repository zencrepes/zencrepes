import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import StatsBinBar from '../../../../../components/Charts/StatsBinBar.js';

class BinsOpenedDuring extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { statsBins } = this.props;
        return (
            <CustomCard
                headerTitle="Were open during"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Issues with a CLOSED state, amount of time stayed open."
            >
                <StatsBinBar
                    dataset={statsBins}
                />
            </CustomCard>
        );
    }
}

BinsOpenedDuring.propTypes = {
    statsBins: PropTypes.array.isRequired,
};

export default BinsOpenedDuring;
