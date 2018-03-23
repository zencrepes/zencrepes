//https://www.npmjs.com/package/react-jsx-highcharts
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { connect } from "react-redux";

import Highcharts from 'highcharts/highstock';
import {
    HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, Legend,
    AreaSplineSeries, SplineSeries, ColumnSeries, Series, Navigator, RangeSelector, Tooltip
} from 'react-jsx-highstock';

import {render} from "react-dom";

const mapStateToProps = state => {
    return {
        completionEstimate: state.completionEstimate
    };
};

class DaysToCompletion extends Component {
    constructor (props) {
        super(props);
    }

    componentWillUnmount() {
        this.state.subscription.tasks.stop();
    }

    getCategories(){
        return this.props.completionEstimate.map(function(value, idx) {
            return value.range;
        })
    }

    getData(){
        return this.props.completionEstimate.map(function(value, idx) {
            return value.effortCountDays;
        })
    }

    render() {
        return (
            <div className="app">
                <HighchartsChart>
                    <Chart zoomType="x" event="getChartData"/>

                    <Title>Estimated Days to Completion</Title>

                    <Tooltip />

                    <XAxis id="x" name="Using velocity over period" categories={this.getCategories()} />

                    <YAxis id="tickets">
                        <ColumnSeries id="created" name="Days to Completion" color="#F44336" data={this.getData()} />
                    </YAxis>

                </HighchartsChart>

            </div>
        );
    }
}

export default connect(mapStateToProps)(withHighcharts(DaysToCompletion, Highcharts));
