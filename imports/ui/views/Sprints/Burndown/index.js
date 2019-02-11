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
        return (
            <CustomCard
                headerTitle={"Burndown Chart" + this.getDefaultRemainingTxtShrt()}
                headerFactTitle=""
                headerFactValue={""}
            >
                <React.Fragment>
                    <CombinationChart
                        dataset={dataset}
                        defaultPoints={defaultPoints}
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