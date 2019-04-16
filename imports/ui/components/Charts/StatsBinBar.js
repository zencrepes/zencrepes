import React, { Component } from 'react';
import PropTypes from "prop-types";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {withRouter} from "react-router-dom";

class StatsBinBar extends Component {
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
                type: 'column',
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
                column: {
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
                name: 'Issues',
                showInLegend: false,
                data: dataset.map((cat) => {
                    return {
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

StatsBinBar.propTypes = {
    dataset: PropTypes.array,
    history: PropTypes.object.isRequired,
};

export default withRouter(StatsBinBar);
