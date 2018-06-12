//https://github.com/creativetimofficial/material-dashboard-react/blob/master/src/components/Cards/StatsCard.jsx
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import statsCardStyle from './statsCardStyle.jsx';

import VelocityBarHorizontal from '../shared/VelocityBarHorizontal.js';

import {withRouter} from "react-router-dom";
import {getWeekYear} from "../../../utils/velocity";

class DaysToCompletion extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    /*
    TODO - Make it better, very very badly coded
    Find effortCountDays closest to current date
    */
    getTimeToCompletion(dataset) {
        if (dataset !== undefined ) {
            let filteredValues = dataset.filter(v => v.effortCountDays !== undefined)

            let rangeValues = [];
            effort = filteredValues.find(v => v.range === '4w');
            if (effort !== undefined) {
                if (effort['effortCountDays'] !== undefined && effort['effortCountDays'] !== Infinity) {
                    rangeValues.push(effort);
                }
            }

            effort = filteredValues.find(v => v.range === '8w');
            if (effort !== undefined) {
                if (effort['effortCountDays'] !== undefined && effort['effortCountDays'] !== Infinity) {
                    rangeValues.push(effort);
                }
            }
            effort = filteredValues.find(v => v.range === '12w');
            if (effort !== undefined) {
                if (effort['effortCountDays'] !== undefined && effort['effortCountDays'] !== Infinity) {
                    rangeValues.push(effort);
                }
            }
            effort = filteredValues.find(v => v.range === 'all');
            if (effort !== undefined) {
                if (effort['effortCountDays'] !== undefined && effort['effortCountDays'] !== Infinity) {
                    rangeValues.push(effort);
                }
            }
            if (rangeValues.length === 0) {
                return '-';
            } else {
                return Math.round(rangeValues[0]['effortCountDays'], 1);
            }

        } else {
            return '-';
        }
    }

    getVelocityBar(dataset) {
        if (dataset !== undefined ) {
            dataset = dataset.filter(v => v.effortCountDays !== Infinity);
            dataset = dataset.map((v) => {
                return {x: v.range, y: v.effortCountDays}
            });
            return dataset;
        } else {
            return [];
        }
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
        const { velocity } = this.props;

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
                        Days To Completion
                    </Typography>
                    <Typography
                        variant="headline"
                        component="h2"
                        className={classes.cardTitle}
                    >
                        {this.getTimeToCompletion(velocity.velocity)}{" "}
                        {small !== undefined ? (
                            <small className={classes.cardTitleSmall}>{small}</small>
                        ) : null}
                    </Typography>
                    <VelocityBarHorizontal data={this.getVelocityBar(velocity.velocity)} />
                </CardContent>
                <CardActions className={classes.cardActions}>
                    <div className={classes.cardStats}>
                        Default based on 4 weeks rolling averages
                    </div>
                </CardActions>
            </Card>
        )
    };
}

DaysToCompletion.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
});


const mapState = state => ({
    velocity: state.velocity.velocity,
});

export default connect(mapState, mapDispatch)(withStyles(statsCardStyle)(DaysToCompletion));
