import React, { Component } from 'react';
import CustomCard from "../../../components/CustomCard/index.js";

import SwitchForecast from './SwitchForecast.js';
import GitHubActivity from './GitHubActivity.js';

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
                <GitHubActivity />
                <SwitchForecast />
            </CustomCard>
        );
    }
}

export default Controls;
