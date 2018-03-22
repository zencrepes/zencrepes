//https://www.npmjs.com/package/react-jsx-highcharts
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { connect } from "react-redux";

import Highcharts from 'highcharts/highstock';
import {
    HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis, Title, Legend,
    AreaSplineSeries, SplineSeries, Navigator, RangeSelector, Tooltip
} from 'react-jsx-highstock';

const mapStateToProps = state => {
    return { weeklyOpenedIssueCount: state.weeklyOpenedIssueCount, weeklyClosedIssueCount: state.weeklyClosedIssueCount };
};

class StatsPerWeek extends Component {
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

    getCreatedTicketsByWeek() {
        return this.props.weeklyOpenedIssueCount;
    }
    getClosedTicketsByWeek() {
        return this.props.weeklyClosedIssueCount;
    }

    render() {
        const { data1, data2 } = this.state;

        return (
            <div className="app">
                <HighchartsStockChart>
                    <Chart zoomType="x" event="getChartData"/>

                    <Title>Tickets Open & Closed per Week</Title>

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
                        <SplineSeries id="closed" name="Closed" data={this.getCreatedTicketsByWeek()} />
                    </YAxis>

                    <YAxis id="social" opposite>
                        <YAxis.Title>Tickets</YAxis.Title>
                        <SplineSeries id="created" name="Created" data={this.getClosedTicketsByWeek()} />
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

export default connect(mapStateToProps)(withHighcharts(StatsPerWeek, Highcharts));


