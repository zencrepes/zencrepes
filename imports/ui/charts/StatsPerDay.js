//https://www.npmjs.com/package/react-jsx-highcharts
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { connect } from "react-redux";

import { array_issues_per_day } from '../../data/DailyStats.js'
import { stats_issues_per_day } from '../../data/DailyStats.js'

import Highcharts from 'highcharts/highstock';
import {
    HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis, Title, Legend,
    AreaSplineSeries, SplineSeries, Navigator, RangeSelector, Tooltip
} from 'react-jsx-highstock';
import {local_gh_issues} from "../../data_fetch/LoadIssues";
import {render} from "react-dom";
import {local_gh_repositories} from "../../data_fetch/LoadRepos";
import {local_gh_organizations} from "../../data_fetch/LoadOrgs";


const mapStateToProps = state => {
    return { dailyIssuesCount: state.dailyIssuesCount, closedIssuesDays: state.closedIssuesDays };
};

class StatsPerDay extends Component {
    constructor (props) {

        super(props);

        const now = Date.now();
        this.state = {
            data1: [],
            data2: [],
        };
    }

    componentWillUnmount() {
        this.state.subscription.tasks.stop();
    }

    getCreatedTicketsByDay() {
        return this.props.dailyIssuesCount;
    }
    getClosedTicketsByDay() {
        return this.props.closedIssuesDays;
    }

    render() {
        const { data1, data2 } = this.state;

        return (
            <div className="app">
                <HighchartsStockChart>
                    <Chart zoomType="x" event="getChartData"/>

                    <Title>Tickets Open & Closed per day</Title>

                    <Legend />

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
                        <YAxis.Title>Tickets</YAxis.Title>
                        <SplineSeries id="closed" name="Closed" data={this.getClosedTicketsByDay()} />
                    </YAxis>

                    <YAxis id="social" opposite>
                        <YAxis.Title>Tickets</YAxis.Title>
                        <SplineSeries id="created" name="Created" data={this.getCreatedTicketsByDay()} />
                    </YAxis>

                    <Navigator>
                        <Navigator.Series seriesId="closed" />
                        <Navigator.Series seriesId="created" />
                    </Navigator>
                </HighchartsStockChart>

            </div>
        );
    }
}

/*
export default withHighcharts(withTracker(() => {
    return {
        array_issues_per_day: array_issues_per_day,
    };
})(StatsPerDay), Highcharts);
*/
export default connect(mapStateToProps)(withHighcharts(StatsPerDay, Highcharts));


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