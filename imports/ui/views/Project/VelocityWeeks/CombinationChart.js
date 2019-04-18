import React, { Component } from 'react';
import PropTypes from "prop-types";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {withRouter} from "react-router-dom";

class CombinationChart extends Component {
    constructor(props) {
        super(props);
    }

    getLegend = () => {
        const { completed, max } = this.props;
        return completed + " / " + max;
    };

    clickBar = (event) => {
        if (event.point.issues !== undefined && event.point.issues.length > 0) {
            const issues = event.point.issues;
            const issuesArrayQuery = issues.map(issue => issue.id);
            const query = {'id': {'$in': issuesArrayQuery}};
            this.props.history.push({
                pathname: '/issues',
                search: '?q=' + JSON.stringify(query),
                state: { detail: query }
            });
        }
    };

    /*
    formatTooltip = (tooltip) => {
        console.log(tooltip);
    };
    */
    render() {
        const { dataset, metric } = this.props;
        let updatedOptions = {
            chart: {
                height: 300,
            },
            title: null,
            xAxis: {
                categories: dataset.map(week => new Date(week.weekStart)),
                type: 'datetime',
                labels: {
                    format: '{value:%b. %e}'
                },
            },
            rangeSelector: {
                selected: 1
            },
            tooltip: {
                //formatter: this.formatTooltip
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
                    events: {
                        click: this.clickBar
                    }
                }
            },
            series: [{
                type: 'column',
                name: 'Completed',
                data: dataset.map((week) => {
                    if (week.completion[metric].count - week.scopeChangeCompletion[metric].count > 0) {
                        return {
                            y: week.completion[metric].count - week.scopeChangeCompletion[metric].count,
                            issues: week.completion.list,
                        };
                    } else {
                        return 0;
                    }
                })
            }, {
                type: 'column',
                name: 'Scope Change',
                data: dataset.map((week) => {
                    return {
                        y: week.scopeChangeCompletion[metric].count,
                        issues: week.scopeChangeCompletion.list,
                    }
                })
            }, {
                type: 'spline',
                name: 'Velocity',
                data: dataset.map(week => week.completion[metric].velocity),
                marker: {
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[3],
                    fillColor: 'white'
                }
            }, {
                type: 'spline',
                name: 'SC Evo.',
                data: dataset.map(week => week.scopeChangeCompletion[metric].velocity),
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
    classes: PropTypes.object,
    completed: PropTypes.number,
    max: PropTypes.number,
    history: PropTypes.object,
    dataset: PropTypes.array,
    metric: PropTypes.string,
};

export default withRouter(CombinationChart);
