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

import ReposTreemap from './ReposTreemap.js';

class RemainingPoints extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    getDefaultRemaining() {
        const { defaultPoints, remainingCount, remainingPoints } = this.props;
        if (defaultPoints) {
            return remainingPoints;
        } else {
            return remainingCount;
        }
    };

    getDefaultRemainingTxt() {
        const { defaultPoints } = this.props;
        if (defaultPoints) {
            return 'Points';
        } else {
            return 'Issues';
        }
    };

    handleChange = name => event => {
        const { setDefaultPoints } = this.props;
        setDefaultPoints(event.target.checked);
    };



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
        const { velocity, remainingCount, remainingPoints, defaultPoints } = this.props;

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
                        Remaining {this.getDefaultRemainingTxt()}
                    </Typography>
                    <Typography
                        variant="headline"
                        component="h2"
                        className={classes.cardTitle}
                    >
                        {this.getDefaultRemaining()}{" "}
                        {small !== undefined ? (
                            <small className={classes.cardTitleSmall}>{small}</small>
                        ) : null}
                    </Typography>
                    <ReposTreemap />
                </CardContent>
                <CardActions className={classes.cardActions}>
                    <div className={classes.cardStats}>
                        Work repartition by repository
                    </div>
                </CardActions>
            </Card>
        )
    };
}

RemainingPoints.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    setDefaultPoints: dispatch.remaining.setDefaultPoints,

});


const mapState = state => ({
    velocity: state.velocity.velocity,
    remainingCount: state.remaining.count,
    remainingPoints: state.remaining.points,
    defaultPoints: state.remaining.defaultPoints,
});

export default connect(mapState, mapDispatch)(withStyles(statsCardStyle)(RemainingPoints));
