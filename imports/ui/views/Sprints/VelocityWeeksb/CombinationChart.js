import React, { Component } from 'react';
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);

const styles = theme => ({
    root: {
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
    toolbarButtons: {
        flex: 1,
    },
});

class GaugeChart extends Component {
    constructor(props) {
        super(props);
    }

    getLegend = () => {
        const { completed, max } = this.props;
        return completed + " / " + max;
    };

    render() {
        const { classes, dataset } = this.props;
        console.log(dataset);
        const updatedOptions = {
            title: null,
            xAxis: {
                categories: dataset.map(week => new Date(week.weekStart).toDateString()),
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%e. %b'
                }
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
                }
            },
            series: [{
                type: 'column',
                name: 'Actual Completion',
                data: dataset.map((week) => {
                    if (week.completion.points.count - week.scopeChangeCompletion.points.count > 0) {
                        return week.completion.points.count - week.scopeChangeCompletion.points.count;
                    } else {
                        return 0;
                    }
                })
            }, {
                type: 'column',
                name: 'Scope Change',
                data: dataset.map(week => week.scopeChangeCompletion.points.count)
            }, {
                type: 'spline',
                name: 'Rolling Average',
                data: dataset.map(week => week.completion.points.velocity),
                marker: {
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[3],
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

GaugeChart.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(GaugeChart);