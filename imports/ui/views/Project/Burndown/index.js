import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from '../../../components/CustomCard/index.js';
import CombinationChart from './CombinationChart.js';

class CurrentCompletion extends Component {
    constructor(props) {
        super(props);
    }

    buildDataset() {
        const { burndown } = this.props;
        if (burndown['days'] !== undefined ) {
            return burndown['days'];
        } else {
            return [];
        }
    }

    getDefaultRemainingTxtShrt() {
        const { defaultPoints } = this.props;
        if (defaultPoints) {
            return '';
        } else {
            return ' (Tkts)';
        }
    }

    render() {
        const { defaultPoints } = this.props;
        const dataset = this.buildDataset();
        let metric = 'points';
        if (!defaultPoints) {metric = 'count';}

        return (
            <CustomCard
                headerTitle={"Burndown Chart" + this.getDefaultRemainingTxtShrt()}
                headerFactTitle="Displaying points"
                headerFactValue={""}
                headerLegend="This chart displays the burndown as well as closed issues per day. Start and End date of the chart are based on first closed and last closed issues."
            >
                <React.Fragment>
                    <CombinationChart
                        dataset={dataset}
                        defaultPoints={defaultPoints}
                        metric={metric}
                    />
                </React.Fragment>
            </CustomCard>
        );
    }
}

CurrentCompletion.propTypes = {
    burndown: PropTypes.object.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
};

export default CurrentCompletion;