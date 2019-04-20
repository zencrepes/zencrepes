import React, { Component } from 'react';

import CustomCard from "../../../../components/CustomCard/index.js";

import DownloadCSV from './DownloadCSV.js';

class Contributions extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <CustomCard
                headerTitle="Contributions over the past 30 days"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="This view will contain a breakdown of all areas, projects and milestones, users contributed to (in the form of closed issues) during the past 30 days."
            >
                <span>This view will contain a breakdown of all areas, projects and milestones, users contributed to through closing issues in the past 30 days.</span><br />
                <DownloadCSV/>
            </CustomCard>
        );
    }
}

export default Contributions;

