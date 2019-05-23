import React, { Component } from 'react';
import CustomCard from "../../../components/CustomCard/index.js";

import SwitchPoints from './SwitchPoints.js';

class Controls extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CustomCard
                headerTitle=""
                headerFactTitle=""
                headerFactValue=""
            >
                <SwitchPoints />
            </CustomCard>
        );
    }
}

export default Controls;
