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

    render() {
        const dataset = this.buildDataset();
        return (
            <CustomCard
                headerTitle="Burndown Chart"
                headerFactTitle=""
                headerFactValue={""}
            >
                <React.Fragment>
                    <CombinationChart
                        dataset={dataset}
                    />
                </React.Fragment>
            </CustomCard>
        );
    }
}

CurrentCompletion.propTypes = {
    burndown: PropTypes.object.isRequired,
};

export default CurrentCompletion;