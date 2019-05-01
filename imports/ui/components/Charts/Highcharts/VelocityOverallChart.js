import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

class VelocityOverallChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data } = this.props;

        const chartOptions = {
            legend: {
                enabled: true,
            },
            xAxis: {
                title: 'Time'
            },
            yAxis: {
                title: 'Count'
            },
            navigator: {
                enabled: false
            },
            plotOptions: {
                series: {
                    stacking: null
                },
            },
            series: data.map((serie) => {
                return {
                    type: serie.type,
                    name: serie.name,
                    key: serie.id,
                    id: serie.id,
                    data: serie.weeks,
                }
            })
        };

        if (data.length === 0) {
            return null;
        } else {
            return (
                <HighchartsReact
                    highcharts={Highcharts}
                    constructorType={'stockChart'}
                    options={chartOptions}
                />
            );
        }
    }
}

VelocityOverallChart.propTypes = {
    data: PropTypes.array.isRequired,
};

export default VelocityOverallChart;
