import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
//import StatsBinBar from '../../../../../components/Charts/StatsBinBar.js';

class BinsCreatedSince extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        //const { statsBins } = this.props;
        return (
            <CustomCard
                headerTitle="Pullrequests currently in OPEN state"
                headerFactTitle=""
                headerFactValue=""
            >
                <span>To Implemenet</span>
            </CustomCard>
        );
    }
}

BinsCreatedSince.propTypes = {
    statsBins: PropTypes.array.isRequired,
};

export default BinsCreatedSince;

/*
                <StatsBinBar
                    dataset={statsBins}
                />
 */