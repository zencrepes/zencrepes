import React, { Component } from 'react';
import PropTypes from "prop-types";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);

class GaugeChart extends Component {
    constructor(props) {
        super(props);
    }

    getLegend = () => {
        const { completed, max } = this.props;
        return completed + " / " + max;
    };

    render() {
        const { title, completed, max } = this.props;

        const options = {
            chart: {
                type: 'solidgauge',
                height: 300,
            },

            title: null,

            pane: {
                center: ['50%', '85%'],
//        size: '140%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },

            tooltip: {
                enabled: false
            },

            // the value axis
            yAxis: {
                stops: [
                    [0.1, '#DF5353'], // red
                    [0.5, '#DDDF0D'], // yellow
                    [0.9, '#55BF3B'], // green
                ],
                lineWidth: 0,
                minorTickInterval: null,
                tickAmount: 1,
                labels: {
                    y: 16
                },
                min: 0,
                max: 200,
            },
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            },
            credits: {
                enabled: false
            }
        };

        let updatedOptionsGauge = {
            ...options,
            yAxis: {
                ...options.yAxis,
                title: {
                    y: -70,
                    text: title
                },
                max: max,
            },
            series: [{
                name: 'blank',
                data: [completed],
                dataLabels: {
                    formatter: this.getLegend,
                    /*
                    format:'<div style="text-align:center"><span style="font-size:25px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y} {x}</span><br/>' +
                        '<span style="font-size:12px;color:silver">{legend}</span></div>'
                        */
                },
                tooltip: {
                    valueSuffix: ' km/h'
                }
            }]
        };
        return (
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'chart'}
                options={updatedOptionsGauge}
            />
        );
    }
}

GaugeChart.propTypes = {
    title: PropTypes.string.isRequired,
    completed: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
};

export default GaugeChart;