import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { Refresh } from 'mdi-material-ui';


import VelocityChart from './VelocityChart.js';
import TextField from '@material-ui/core/TextField';

import { cfgQueries } from '../../../data/Queries.js';

const styles = theme => ({
    card: {
        maxWidth: 400,
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: '#FFFFFF',
    },
});

class WeeklyVelocity extends Component {
    constructor (props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { classes } = this.props;
        console.log('WeeklyVelocity - render()');
        return (
            <Card className={classes.card}>
                <CardHeader
                    action={
                        <IconButton>
                            <Refresh />
                        </IconButton>
                    }
                    title="Weekly Velocity"
                />
                <CardContent>
                    <VelocityChart />
                </CardContent>
            </Card>
        );

    };
}

WeeklyVelocity.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(WeeklyVelocity));
