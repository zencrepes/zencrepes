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

class StatsCard extends Component {
    constructor (props) {
        super(props);
        this.state = {};
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
                        {description}{" "}
                        {small !== undefined ? (
                            <small className={classes.cardTitleSmall}>{small}</small>
                        ) : null}
                    </Typography>
                </CardContent>
                <CardActions className={classes.cardActions}>
                    <div className={classes.cardStats}>
                        <this.props.statIcon
                            className={
                                classes.cardStatsIcon +
                                " " +
                                classes[statIconColor + "CardStatsIcon"]
                            }
                        />{" "}
                        {statLink !== undefined ? (
                            <a href={statLink.href} className={classes.cardStatsLink}>
                                {statLink.text}
                            </a>
                        ) : statText !== undefined ? (
                            statText
                        ) : null}
                    </div>
                </CardActions>
            </Card>
        )
    };
}

StatsCard.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(statsCardStyle)(StatsCard);
