import React, { Component } from 'react';
import PropTypes from "prop-types";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class CombinationChart extends Component {
    constructor(props) {
        super(props);
    }

    getLegend = () => {
        const { completed, max } = this.props;
        return completed + " / " + max;
    };

    render() {
        const { dataset, metric } = this.props;
        console.log(dataset);
        let updatedOptions = {
            chart: {
                height: 300,
            },
            title: null,
            xAxis: {
                categories: dataset.map(day => new Date(day.date)),
                type: 'datetime',
                labels: {
                    format: '{value:%b. %e}'
                },
            },
            tooltip: {
                formatter: function () {
                    return Highcharts.dateFormat('%B %e, %Y', this.x) + '<br/>' +
                        this.series.name + ':' + Highcharts.numberFormat(this.y);
                },
            },
            yAxis: {
                title: metric
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                },
                series: {
                    pointPadding: 0,
                    groupPadding: 0,
                }
            },
            series: [{
                type: 'column',
                name: 'Daily completion',
                data: dataset.map((day) => {
                    if (day.completion[metric].count - day.scopeChangeCompletion[metric].count > 0) {
                        return day.completion[metric].count - day.scopeChangeCompletion[metric].count;
                    } else {
                        return 0;
                    }
                })
            }, {
                type: 'column',
                name: 'Scope Change',
                data: dataset.map(day => day.scopeChangeCompletion[metric].count)
            }, {
                type: 'spline',
                name: 'Velocity',
                data: dataset.map(day => day.completion[metric].velocity),
                marker: {
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[3],
                    fillColor: 'white'
                }
            }, {
                type: 'spline',
                name: 'Scope Change evo.',
                data: dataset.map(day => day.scopeChangeCompletion[metric].velocity),
                marker: {
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[4],
                    fillColor: 'white'
                }
            }],
            credits: {
                enabled: false
            }
        };

        return (
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'chart'}
                options={updatedOptions}
            />
        );
    }
}

CombinationChart.propTypes = {
    completed: PropTypes.number,
    max: PropTypes.number,
    dataset: PropTypes.array,
    metric: PropTypes.string,
};

export default CombinationChart;