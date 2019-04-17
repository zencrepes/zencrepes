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
        const { dataset, defaultPoints } = this.props;
        let updatedOptions = {
            chart: {
                height: 300,
            },
            title: null,
            xAxis: {
                categories: dataset.map(day => new Date(day.date)),
                type: 'datetime',
                labels: {
                    format: '{value:%a %b. %e}'
                },
            },
            tooltip: {
                formatter: function () {
                    return Highcharts.dateFormat('%B %e, %Y', this.x) + '<br/>' +
                        this.series.name + ':' + Highcharts.numberFormat(this.y);
                },
            },
            yAxis: {
                title: 'Points'
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
                    if (defaultPoints) {
                        return day.points.closed;
                    } else {
                        return day.count.closed;
                    }
                })
            }, {
                type: 'spline',
                name: 'Burndown',
                data: dataset.map((day) => {
                    if (defaultPoints) {
                        return day.points.remaining;
                    } else {
                        return day.count.remaining;
                    }
                }),
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
    defaultPoints: PropTypes.bool.isRequired,
};

export default CombinationChart;