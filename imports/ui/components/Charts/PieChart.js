import React, { Component } from 'react';
import PropTypes from "prop-types";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {withRouter} from "react-router-dom";

class PieChart extends Component {
    constructor(props) {
        super(props);
    }

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


    render() {
        const { dataset } = this.props;
        let updatedOptions = {
            chart: {
                height: 200,
                type: 'pie',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
            },
            title: null,
            xAxis: {
                categories: dataset.map(cat => cat.label),
            },
            yAxis: {
                min: 0,
                title: 'Issues count'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                },
                series: {
                    pointPadding: 0,
                    groupPadding: 0,
                    events: {
                        click: this.clickBar
                    }
                },
            },
            legend: {
                enabled: true,
                labelFormatter: function() {
                    return '<span>' + this.name + ' (' + this.y + ')</span>';
                },
            },
            series: [{
                name: 'Issues',
                showInLegend: true,
                data: dataset.map((cat) => {
                    return {
                        name: cat.name,
                        color: cat.color,
                        y: cat.issues.length,
                        issues: cat.issues,
                    };
                })
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

PieChart.propTypes = {
    dataset: PropTypes.array,
    history: PropTypes.object.isRequired,
};

export default withRouter(PieChart);
