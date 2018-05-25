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

    render() {
        console.log('render()');
        const marker = {
            enabled: true,
            radius: 2
        }
        return (
            <HighchartsStockChart>
                <Chart zoomType="x" event="getChartData"/>

                <Title>Tickets Open & Closed per day (Monday-Friday)</Title>

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
/*
 <Series id="created" name="Created" lineWidth="0" color="#F44336" marker={marker} data={this.getData} />
 <SplineSeries id="created-velocity" name="Created (Velocity)" color="#F44336" data={this.getData} />
 <Series id="closed" name="Closed" lineWidth="0" marker={marker} color="#03A9F4" data={this.getData} />
 <SplineSeries id="closed-velocity" name="Closed (Velocity)" color="#03A9F4" data={this.getData} />

 */
CompletionChart.propTypes = {
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
});

export default connect(mapState, mapDispatch)(withHighcharts(CompletionChart, Highcharts));