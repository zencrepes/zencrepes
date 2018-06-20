//https://github.com/creativetimofficial/material-dashboard-react/blob/master/src/components/Cards/StatsCard.jsx
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import cx from "classnames";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import regularCardStyle from './regularCardStyle.jsx';

import VelocityLine from './VelocityLine.js';
import HighchartsVelocity from '../shared/HighchartsVelocity.js';

import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {getWeekYear} from "../../../utils/velocity";

class OverallVelocityWeeks extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    getVelocityLine(dataset) {
        if (dataset.length > 0 ) {
            dataset = dataset.map((v) => {
                return {x: getWeekYear(new Date(v.weekStart)).toString(), y: v.issues.velocity}
            });
            dataset = dataset.filter(v => v.y !== undefined);
            //console.log(dataset);
            return [{id: 'rolling', data: dataset}];
            //return [{id: 'rolling', data: []}];
        } else {
            return [{id: 'rolling', data: []}];
        }
    }

    getVelocityHighcharts(velocity) {
        let issuesCount = [];
        let storyPoints = [];
        console.log(velocity);
        velocity.forEach((v) => {
            issuesCount.push([new Date(v.weekStart).getTime(), Math.round(v.issues.velocity, 1)]);
            storyPoints.push([new Date(v.weekStart).getTime(), Math.round(v.points.velocity, 1)]);
        });
        if (issuesCount.length === 0) {
            return [];
        } else {
            return [
                {id: 'issues', name: 'Issues', weeks: issuesCount},
                {id: 'points', name: 'Story Points', weeks: storyPoints}
            ];
        }
    }

    buildDataset() {
        const { velocity } = this.props;
        if (velocity['weeks'] !== undefined ) {
            return velocity['weeks'];
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
            headerColor,
            plainCard,
            content,
            footer
        } = this.props;
        const plainCardClasses = cx({
            [" " + classes.cardPlain]: plainCard
        });
        const cardPlainHeaderClasses = cx({
            [" " + classes.cardPlainHeader]: plainCard
        });


        let dataset = this.buildDataset();
        console.log(this.getVelocityLine(dataset));

        return (
            <Card className={classes.card + plainCardClasses}>
                <CardHeader
                    classes={{
                        root:
                        classes.cardHeader +
                        " " +
                        classes['blue' + "CardHeader"] +
                        cardPlainHeaderClasses,
                        title: classes.cardTitle,
                        subheader: classes.cardSubtitle
                    }}
                    title='Overall weekly velocity throughout the entire period'
                />
                <CardContent>
                    <HighchartsVelocity data={this.getVelocityHighcharts(dataset)} />
                </CardContent>
                {footer !== undefined ? (
                    <CardActions className={classes.cardActions}>{footer}</CardActions>
                ) : null}
            </Card>
        )
    };
}

/*
 <RepartitionTreemap />
 <VelocityLine data={this.getVelocityLine(dataset)} />


 */

OverallVelocityWeeks.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
});


const mapState = state => ({
    velocity: state.velocity.velocity,
});

export default connect(mapState, mapDispatch)(withStyles(regularCardStyle)(OverallVelocityWeeks));
