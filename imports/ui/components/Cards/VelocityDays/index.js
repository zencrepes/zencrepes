//https://github.com/creativetimofficial/material-dashboard-react/blob/master/src/components/Cards/StatsCard.jsx
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import statsCardStyle from './statsCardStyle.jsx';

import VelocityBar from '../shared/VelocityBar.js';
import VelocityLine from '../shared/VelocityLine.js';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {getWeekYear} from "../../../utils/velocity";

import Highcharts from 'highcharts/highcharts';
import {
    HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, Subtitle, Legend, LineSeries
} from 'react-jsx-highcharts';

import tableStyle from "../OverallMemberVelocityWeeks/tableStyle";

class VelocityDays extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    getVelocityLine(dataset) {
        console.log(dataset);
        if (dataset.length > 0 ) {
            dataset = dataset.map((v) => {
                return {x: new Date(v.date).getDate().toString(), y: v.issues.velocity}
            });
            console.log(dataset);
            return [{id: 'rolling', data: dataset}];
        } else {
            return [{id: 'rolling', data: []}];
        }
    }

    getVelocityBar(dataset) {
        if (dataset.length > 0 ) {
            dataset = dataset.map((v) => {
                return {x: new Date(v.date).getDate().toString(), y: v.issues.count}
            });
            return dataset;
        } else {
            return [];
        }
    }

    buildDataset() {
        const { velocity } = this.props;
        if (velocity['days'] !== undefined ) {
            let startPos = 0;
            let endPos = velocity['days'].length;
            if (velocity['days'].length > 20) {
                startPos = velocity['days'].length - 20;
            }
            return velocity['days'].slice(startPos, endPos);
        } else {
            return [];
        }
    }

    getLastDayCompleted(dataset) {
        let idx = dataset.length - 1;
        if (idx >= 0) {
            return dataset[idx].issues.count;
        } else {
            return '-';
        }
    }

    getLastDayTxtCompleted(dataset) {
        let idx = dataset.length - 1;
        if (idx >= 0) {
            return new Date(dataset[idx]['date']).toLocaleDateString('en-US', { weekday: 'long' });
        } else {
            return '-';
        }
    }

    massageDataForHighchart(data, type) {
        console.log(data);
        let dataset = [];
        data.forEach((v) => {
            dataset.push([new Date(v.date).getTime(), Math.round(v[type].velocity, 1)]);
        });
        console.log(dataset);
        return dataset
    }

    render() {
        const {
            classes,
            title,
            description,
            statLink,
            small,
            statText,
            statIconColor,
            iconColor } = this.props;

        let dataset = this.buildDataset();

        return (
            <Card className={classes.card}>
                <CardHeader
                    classes={{
                        root: classes.cardHeader + " " + classes[iconColor + "CardHeader"],
                        avatar: classes.cardAvatar
                    }}
                    avatar={<this.props.icon className={classes.cardIcon} />}
                />
                <CardContent className={classes.cardContent}>
                    <Typography component="p" className={classes.cardCategory}>
                        Completed {this.getLastDayTxtCompleted(dataset)}
                    </Typography>
                    <Typography
                        variant="headline"
                        component="h2"
                        className={classes.cardTitle}
                    >
                        {this.getLastDayCompleted(dataset)}{" "}
                        {small !== undefined ? (
                            <small className={classes.cardTitleSmall}>{small}</small>
                        ) : null}
                    </Typography>
                    <VelocityBar data={this.getVelocityBar(dataset)} />
                    <HighchartsChart>
                        <Chart />
                        <XAxis>
                            <XAxis.Title>Time</XAxis.Title>
                        </XAxis>

                        <YAxis>
                            <YAxis.Title>Number of employees</YAxis.Title>
                            <LineSeries name="Installation" data={this.massageDataForHighchart(dataset, 'issues')} />
                            <LineSeries name="Manufacturing" data={this.massageDataForHighchart(dataset, 'points')} />
                        </YAxis>
                    </HighchartsChart>
                    <VelocityLine data={this.getVelocityLine(dataset)} />
                </CardContent>
                <CardActions className={classes.cardActions}>
                    <div className={classes.cardStats}>
                        Velocity over the past 20 days
                    </div>
                </CardActions>
            </Card>
        )
    };
}

VelocityDays.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
});


const mapState = state => ({
    velocity: state.velocity.velocity,
    defaultPoints: state.velocity.defaultPoints,
});

export default
    connect(mapState, mapDispatch)(
        withStyles(statsCardStyle)(
            withHighcharts(VelocityDays, Highcharts)
        )
    );
