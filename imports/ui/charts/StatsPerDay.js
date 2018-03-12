//https://www.npmjs.com/package/react-jsx-highcharts
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { array_issues_per_day } from '../../data/DailyStats.js'

import Highcharts from 'highcharts/highstock';
import {
    HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis, Title, Legend,
    AreaSplineSeries, SplineSeries, Navigator, RangeSelector, Tooltip
} from 'react-jsx-highstock';
import {local_gh_issues} from "../../data_fetch/LoadIssues";
import {render} from "react-dom";
import {local_gh_repositories} from "../../data_fetch/LoadRepos";
import {local_gh_organizations} from "../../data_fetch/LoadOrgs";

export const createDataPoint = (time = Date.now(), magnitude = 1000, offset = 0) => {
    return [
        time + offset * magnitude,
        Math.round((Math.random() * 100) * 2) / 2
    ];
};

export const createRandomData = (time, magnitude, points = 100) => {
    const data = [];
    let i = (points * -1) + 1;
    for (i; i <= 0; i++) {
        data.push(createDataPoint(time, magnitude, i));
    }
    return data;
};

export const addDataPoint = (data, toAdd) => {
    if (!toAdd) toAdd = createDataPoint();
    const newData = data.slice(0); // Clone
    newData.push(toAdd);
    return newData;
};

class StatsPerDay extends Component {
    constructor (props) {

        super(props);

        const now = Date.now();
        this.state = {
            data1: createRandomData(now, 1e7, 500),
            data2: props.array_issues_per_day
        };
    }
    render() {
        const { data1, data2 } = this.state;

        return (
            <div className="app">
                <HighchartsStockChart>
                    <Chart zoomType="x" />

                    <Title>Tickets Open & Closed per day</Title>

                    <RangeSelector>
                        <RangeSelector.Button count={1} type="month">1m</RangeSelector.Button>
                        <RangeSelector.Button count={3} type="month">3m</RangeSelector.Button>
                        <RangeSelector.Button count={6} type="month">6m</RangeSelector.Button>
                        <RangeSelector.Button count={12} type="month">1y</RangeSelector.Button>
                        <RangeSelector.Button type="all">All</RangeSelector.Button>
                        <RangeSelector.Input boxBorderColor="#7cb5ec" />
                    </RangeSelector>

                    <Tooltip />

                    <XAxis>
                        <XAxis.Title>Time</XAxis.Title>
                    </XAxis>

                    <YAxis id="price">
                        <YAxis.Title>Price</YAxis.Title>
                        <SplineSeries id="profit" name="Profit" data={data1} />
                    </YAxis>

                    <YAxis id="social" opposite>
                        <YAxis.Title>Social Buzz</YAxis.Title>
                        <SplineSeries id="twitter" name="Twitter mentions" data={data2} />
                    </YAxis>

                    <Navigator>
                        <Navigator.Series seriesId="profit" />
                        <Navigator.Series seriesId="twitter" />
                    </Navigator>
                </HighchartsStockChart>

            </div>
        );
    }
}

export default withHighcharts(withTracker(() => {
    Meteor.setTimeout(function() {
        console.log(array_issues_per_day);
    }, 10000);
    return {
        array_issues_per_day: array_issues_per_day,
    };
})(StatsPerDay), Highcharts);


/*
import Highcharts from 'highcharts';
import {
    HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, Subtitle, Legend, LineSeries
} from 'react-jsx-highcharts';

const plotOptions = {
    series: {
        pointStart: 2010
    }
};

class StatsPerDay extends Component {
    render () {
        return (
            <HighchartsChart plotOptions={plotOptions}>
                <Chart />

                <Title>Solar Employment Growth by Sector, 2010-2016</Title>

                <Subtitle>Source: thesolarfoundation.com</Subtitle>

                <Legend layout="vertical" align="right" verticalAlign="middle" />

                <XAxis>
                    <XAxis.Title>Time</XAxis.Title>
                </XAxis>

                <YAxis id="number">
                    <YAxis.Title>Number of employees</YAxis.Title>
                    <LineSeries id="installation" name="Installation" data={[43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]} />
                    <LineSeries id="manufacturing" name="Manufacturing" data={[24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]} />
                </YAxis>
            </HighchartsChart>
        );
    }
}

export default withHighcharts(StatsPerDay, Highcharts);
*/
/*export default withTracker(() => {
    return {
        stats_issues_per_day: stats_issues_per_day,
    };
})(StatsPerDay);
*/