import React, { Component } from 'react';
import PropTypes from "prop-types";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);

class CompletionGauges extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartOptions: {
                chart: {
                    type: 'solidgauge',
                    height: 150,
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
                },
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
                    title: {
                        y: -40,
                        text: ''
                    },
                },
                series: [{
                    name: 'blank',
                    data: [10],
                    dataLabels: {
                        formatter: this.getLegend,
                    },
                }]
            }
        }
    }

    getLegend = () => {
        const { completed, max } = this.props;
        return completed + " / " + max;
    };

    componentDidUpdate(prevProps) {
        const { title, completed, max } = this.props;
        if (prevProps.completed !== completed || prevProps.max !== max || prevProps.title !== title ) {
            this.setState({
                chartOptions: {
                    yAxis: {
                        title: {
                            text: title
                        },
                        max: max,
                    },
                    series: [{
                        name: 'blank',
                        data: [completed],
                        dataLabels: {
                            formatter: this.getLegend,
                        },
                    }]
                }
            })
        }
    }

    render() {
        const {chartOptions} = this.state;

        return (
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'chart'}
                options={chartOptions}
            />
        );

    }
}

CompletionGauges.propTypes = {
    title: PropTypes.string.isRequired,
    completed: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
};

export default CompletionGauges;