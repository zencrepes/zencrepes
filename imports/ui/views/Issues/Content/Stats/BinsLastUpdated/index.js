import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
import StatsBinBar from '../../../../../components/Charts/StatsBinBar.js';

class BinsLastUpdated extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { statsBins } = this.props;
        return (
            <CustomCard
                headerTitle="OPEN issues, time since last update"
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

BinsLastUpdated.propTypes = {
    statsBins: PropTypes.array.isRequired,
};

export default BinsLastUpdated;
