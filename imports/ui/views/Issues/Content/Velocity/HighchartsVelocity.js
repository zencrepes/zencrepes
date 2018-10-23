import React, { Component } from 'react';
import _ from 'lodash';

import {
    withRouter
} from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import Highcharts from 'highcharts/highstock';
import {
    HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis, Title, Legend,
    AreaSplineSeries, SplineSeries, Series, Navigator, RangeSelector, Tooltip
} from 'react-jsx-highstock';

const styles = theme => ({
    root: {
        height: '300px'
    },
});

class HighchartsVelocity extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //series: [],
        };
    }

    renderSeries({ id, name, weeks }) {
        return (
            <SplineSeries name={name} key={id} id={id} data={weeks} />
        )
    };

    render() {
        const { classes, data } = this.props;
        const { series } = this.state;

        const plotOptions =  {
            series: {
                stacking: null
            }
        };
        if (data.length === 0) {
            return null;
        } else {
            return (
                <div>
                    <HighchartsStockChart plotOptions={plotOptions}>
                        <Chart zoomType="x" event="getChartData"/>
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

                        <YAxis id="count">
                            <YAxis.Title>Count</YAxis.Title>
                            {data.map(this.renderSeries)}
                        </YAxis>

                    </HighchartsStockChart>
                </div>
            );
        }
    }
}

HighchartsVelocity.propTypes = {
    //classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});


const mapState = state => ({

});


export default
    connect(mapState, mapDispatch)
    (
        withHighcharts(
            HighchartsVelocity, Highcharts
        )
    );

