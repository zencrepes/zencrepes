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

class VelocityWeek extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    getVelocityLine(dataset) {
        if (dataset.length > 0 ) {
            dataset = dataset.map((v) => {
                return {x: getWeekYear(new Date(v.weekStart)).toString(), y: v.issues.velocity}
            });
            return [{id: 'rolling', data: dataset}];
        } else {
            return [{id: 'rolling', data: []}];
        }
    }

    getVelocityBar(dataset) {
        if (dataset.length > 0 ) {
            dataset = dataset.map((v) => {
                return {x: getWeekYear(new Date(v.weekStart)).toString(), y: v.issues.count}
            });
            return dataset;
        } else {
            return [];
        }
    }

    buildDataset() {
        const { velocity } = this.props;
        if (velocity['weeks'] !== undefined ) {
            let startPos = 0;
            let endPos = velocity['weeks'].length;
            if (velocity['weeks'].length > 16) {
                startPos = velocity['weeks'].length - 16;
            }
            return velocity['weeks'].slice(startPos, endPos);
        } else {
            return [];
        }
    }

    getThisWeekCompleted(dataset) {
        let idx = dataset.length - 1
        if (idx >= 0) {
            return dataset[idx].issues.count;
        } else {
            return '-';
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
                        {title}
                    </Typography>
                    <Typography
                        variant="headline"
                        component="h2"
                        className={classes.cardTitle}
                    >
                        {this.getThisWeekCompleted(dataset)}{" "}
                        {small !== undefined ? (
                            <small className={classes.cardTitleSmall}>{small}</small>
                        ) : null}
                    </Typography>
                    <VelocityBar data={this.getVelocityBar(dataset)}/>
                    <VelocityLine data={this.getVelocityLine(dataset)} />
                </CardContent>
                <CardActions className={classes.cardActions}>
                    <div className={classes.cardStats}>
                        Velocity over the past 20 weeks
                    </div>
                </CardActions>
            </Card>
        )
    };
}

VelocityWeek.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
});


const mapState = state => ({
    velocity: state.velocity.velocity,
});

export default connect(mapState, mapDispatch)(withStyles(statsCardStyle)(VelocityWeek));
