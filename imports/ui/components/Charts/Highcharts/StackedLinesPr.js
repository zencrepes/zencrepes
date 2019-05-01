import React, { Component } from 'react';
import PropTypes from "prop-types";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {withRouter} from "react-router-dom";

class StackedLinesPr extends Component {
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
                pathname: '/pullrequests',
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
        const stackedColumns = dataset.templateDict.map((template) => {
            return {
                type: 'line',
                name: template,
                data: dataset.weeks.map((week) => {
                    let currentCount = 0;
                    if (week.templates[template] !== undefined) {
                        currentCount = week.templates[template].count
                    }
                    return {
                        y: currentCount,
                        issues: week.PRs,
                    };
                })
            }
        });

        stackedColumns.push({
            type: 'line',
            name: 'NO TEMPLATE',
            data: dataset.weeks.map((week) => {
                let noTemplateCount = 0;
                if (week.templateCount['0'] !== undefined) {
                    noTemplateCount = week.templateCount['0'].count;
                }
                return {
                    y: noTemplateCount,
                    issues: week.PRs,
                };
            })
        });

        stackedColumns.push({
            type: 'line',
            name: 'Overall PR Creation',
            data: dataset.weeks.map((week) => {
                return {
                    y: week.totalPRCount,
                    issues: week.PRs,
                };
            })
        });

        let updatedOptions = {
            chart: {
                height: 400,
                zoomType: 'x'
            },
            title: null,
            xAxis: {
                categories: dataset.weeks.map(week => new Date(week.weekStart)),
                type: 'datetime',
                labels: {
                    format: '{value:%b. %e}'
                },
            },
            tooltip: {
                //formatter: this.formatTooltip
                formatter: function () {
                    return Highcharts.dateFormat('%B %e, %Y', this.x) + '<br/>' +
                        this.series.name + ':' + Highcharts.numberFormat(this.y);
                },
            },
            yAxis: {
                title: metric,
                /*
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }*/
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    /*
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                    */
                },
                series: {
                    pointPadding: 0,
                    groupPadding: 0,
                    events: {
                        click: this.clickBar
                    }
                }
            },

            series: stackedColumns,

/*
            series: [{
                type: 'column',
                name: 'Opened',
                data: dataset.weeks.map((week) => {
                    return {
                        y: week.totalPRCount,
                        issues: week.PRs,
                    };
                })
            }],
*/
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

StackedLinesPr.propTypes = {
    classes: PropTypes.object,
    completed: PropTypes.number,
    max: PropTypes.number,
    history: PropTypes.object,
    dataset: PropTypes.object,
    metric: PropTypes.string,
};

export default withRouter(StackedLinesPr);
