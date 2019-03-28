import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";
//import StatsBinBar from '../../../../../components/Charts/StatsBinBar.js';

class BinsOpenedDuring extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        //const { statsBins } = this.props;
        return (
            <CustomCard
                headerTitle="CLOSED pullrequests have been open during"
                headerFactTitle=""
                headerFactValue=""
            >
                <span>To Implement</span>
            </CustomCard>
        );
    }
}

BinsOpenedDuring.propTypes = {
    statsBins: PropTypes.array.isRequired,
};

export default BinsOpenedDuring;
/*
<StatsBinBar
                    dataset={statsBins}
                />
 */
