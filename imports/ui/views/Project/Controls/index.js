import React, { Component } from 'react';
import CustomCard from "../../../components/CustomCard/index.js";

import SwitchForecast from './SwitchForecast.js';
import GitHubActivity from './GitHubActivity.js';
import LabelsFilters from './LabelsFilters/index.js';

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
                <LabelsFilters />
            </CustomCard>
        );
    }
}

export default Controls;
