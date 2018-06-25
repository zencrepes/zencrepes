import React, { Component } from 'react';
import _ from 'lodash';

import {
    withRouter
} from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import Highcharts from 'highcharts';
import {
    HighchartsSparkline, HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, Legend,
    AreaSplineSeries, SplineSeries, Series, Subtitle, AreaSeries, Navigator, RangeSelector, Tooltip
} from 'react-jsx-highstock';

import tableStyle from "../OverallMemberVelocityWeeks/tableStyle";


const styles = theme => ({
    root: {

    },
    highchart: {
        height: '150px',
        width: '100%'
    }
});

const plotOptions =  {
    spline: {
        pointInterval: 3600000, // one hour
        pointStart: Date.UTC(2017, 10, 31, 0, 0, 0)
    }
};

class HighchartsVelocityDays extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    getChart = chart => {
        this.chart = chart;
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <HighchartsSparkline className={classes.highchart}>
                    <AreaSeries data={[0.2, 0.8, 0.8, 0.8, 1, 1.3, 1.5, 2.9, 1.9, 2.6, 1.6, 3, 4, 3.6, 4.5, 4.2, 4.5, 4.5, 4, 3.1, 2.7, 4, 2.7, 2.3, 2.3, 4.1, 7.7, 7.1, 5.6, 6.1, 5.8, 8.6, 7.2, 9, 10.9, 11.5, 11.6, 11.1, 12, 12.3, 10.7, 9.4, 9.8, 9.6, 9.8, 9.5, 8.5, 7.4, 7.6]} />
                </HighchartsSparkline>
                <HighchartsChart >
                    <Chart type="spline" />

                    <Title>Reflow</Title>

                    <Subtitle>Resize the chart on demand</Subtitle>

                    <XAxis type="datetime">
                        <XAxis.Title>Time</XAxis.Title>
                    </XAxis>

                    <YAxis>
                        <YAxis.Title>Frequency</YAxis.Title>
                        <SplineSeries data={[0.2, 0.8, 0.8, 0.8, 1, 1.3, 1.5, 2.9, 1.9, 2.6, 1.6, 3, 4, 3.6, 4.5, 4.2, 4.5, 4.5, 4, 3.1, 2.7, 4, 2.7, 2.3, 2.3, 4.1, 7.7, 7.1, 5.6, 6.1, 5.8, 8.6, 7.2, 9, 10.9, 11.5, 11.6, 11.1, 12, 12.3, 10.7, 9.4, 9.8, 9.6, 9.8, 9.5, 8.5, 7.4, 7.6]} />
                    </YAxis>
                </HighchartsChart>
            </div>
        );
    }
}

HighchartsVelocityDays.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});


const mapState = state => ({

});

export default
    connect(mapState, mapDispatch)
    (
        withRouter
        (
            withStyles(tableStyle)(
                withHighcharts(HighchartsVelocityDays, Highcharts)
            )
        )
    );
