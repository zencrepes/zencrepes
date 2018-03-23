//https://www.npmjs.com/package/react-jsx-highcharts
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { connect } from "react-redux";

import Highcharts from 'highcharts/highstock';
import {
    HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis, Title, Legend,
    AreaSplineSeries, SplineSeries, Series, Navigator, RangeSelector, Tooltip
} from 'react-jsx-highstock';

const mapStateToProps = state => {
    return {
        weekCreated: state.weekCreated,
        weekClosed: state.weekClosed,
        weekVelocityCreated: state.weekVelocityCreated,
        weekVelocityClosed: state.weekVelocityClosed,
    };
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

    getVelocityCreated() {
        return this.props.weekVelocityCreated;
    }

    getVelocityClosed() {
        return this.props.weekVelocityClosed;
    }

    getCreatedTicketsByWeek() {
        return this.props.weekCreated;
    }
    getClosedTicketsByWeek() {
        return this.props.weekClosed;
    }

    render() {
        const { data1, data2 } = this.state;

        const marker = {
            enabled: true,
            radius: 2
        }

        return (
            <div className="app">
                <HighchartsStockChart>
                    <Chart zoomType="x" event="getChartData"/>

                    <Title>Tickets Open & Closed per Week</Title>

                    <Legend />

                    <RangeSelector allButtonsEnabled="true" selected="3">
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

                    <YAxis id="tickets">
                        <YAxis.Title>Tickets Count</YAxis.Title>
                        <Series id="created" name="Created" lineWidth="0" color="#F44336" marker={marker} data={this.getCreatedTicketsByWeek()} />
                        <SplineSeries id="created-velocity" name="Created (Velocity)" color="#F44336" data={this.getVelocityCreated()} />
                        <Series id="closed" name="Closed" lineWidth="0" marker={marker} color="#03A9F4" data={this.getClosedTicketsByWeek()} />
                        <SplineSeries id="closed-velocity" name="Closed (Velocity)" color="#03A9F4" data={this.getVelocityClosed()} />
                    </YAxis>


                    <Navigator>
                        <Navigator.Series seriesId="closed" />
                        <Navigator.Series seriesId="closed-velocity" />
                        <Navigator.Series seriesId="created" />
                        <Navigator.Series seriesId="created-velocity" />
                    </Navigator>
                </HighchartsStockChart>

            </div>
        );
    }
}

export default connect(mapStateToProps)(withHighcharts(StatsPerWeek, Highcharts));


