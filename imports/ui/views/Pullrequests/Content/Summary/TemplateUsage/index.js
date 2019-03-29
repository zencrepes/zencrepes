import React, { Component } from 'react';
import PropTypes from "prop-types";

import CustomCard from "../../../../../components/CustomCard/index.js";

import StackedBar from './StackedBar.js';
//import StatsBinBar from '../../../../../components/Charts/StatsBinBar.js';

class TemplateUsage extends Component {
    constructor(props) {
        super(props);
    }

    buildDataset() {
        const { templateUsage } = this.props;
        if (templateUsage['weeks'] !== undefined ) {
            return templateUsage;
        } else {
            return {weeks: []};
        }
    }

    render() {
        const dataset = this.buildDataset();

        return (
            <CustomCard
                headerTitle="Use of templates in PRs opened each week"
                headerFactTitle=""
                headerFactValue=""
            >
                {dataset.weeks.length > 0 ?
                    <StackedBar
                        dataset={dataset}
                    />
                :
                    <span>No Data</span>
                }
            </CustomCard>
        );
    }
}

TemplateUsage.propTypes = {
    templateUsage: PropTypes.object.isRequired,
};

export default TemplateUsage;

/*
                <StatsBinBar
                    dataset={statsBins}
                />
 */