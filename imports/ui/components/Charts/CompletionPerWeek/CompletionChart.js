import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { connect } from "react-redux";

import Highcharts from 'highcharts/highstock';
import {
    HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis, Title, Legend,
    AreaSplineSeries, SplineSeries, Series, Navigator, RangeSelector, Tooltip
} from 'react-jsx-highstock';


class CompletionChart extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getData() {
        return [];
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.loading === true || nextProps.ticketsPerWeek.length === 0) {
            return false;
        } else {
            return true;
        }
    }


    getCreatedTicketsByWeek() {
        const { ticketsPerWeek } = this.props;
        return ticketsPerWeek.map((value) => {
            return [new Date(value.weekStart).getTime(), value.issues.velocity];
        });
    }

    getVelocityCreated() {
        const { ticketsPerWeek } = this.props;
        return ticketsPerWeek.map((value) => {
            return [new Date(value.weekStart).getTime(), value.issues.count];
        });
    }

    getClosedTicketsByWeek() {
        const { ticketsPerWeek } = this.props;
        return ticketsPerWeek.map((value) => {
            return [new Date(value.weekStart).getTime(), value.issues.velocity];
        });
    }

    getVelocityClosed() {
        const { ticketsPerWeek } = this.props;
        return ticketsPerWeek.map((value) => {
            return [new Date(value.weekStart).getTime(), value.issues.count];
        });
    }

    render() {
        console.log('Week - render()');
        const { ticketsPerWeek, loading } = this.props;
        console.log(ticketsPerWeek);
        const marker = {
            enabled: true,
            radius: 2
        }
        return (
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
        );
    }
}

CompletionChart.propTypes = {
};

const mapState = state => ({
    ticketsPerWeek: state.velocity.ticketsPerWeek,
    loading: state.velocity.loading,
});

const mapDispatch = dispatch => ({
});

export default connect(mapState, mapDispatch)(withHighcharts(CompletionChart, Highcharts));