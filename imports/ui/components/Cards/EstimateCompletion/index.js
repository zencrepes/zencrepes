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


import VelocityTable from './VelocityTable.js';
import TextField from '@material-ui/core/TextField';

import { cfgQueries } from '../../../data/Queries.js';

const styles = theme => ({
    card: {
        maxWidth: 400,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
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

class EstimateCompletion extends Component {
    constructor (props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { classes } = this.props;
        console.log('EstimateCompletion - render()');
        return (
            <Card className={classes.card}>
                <CardHeader
                    action={
                        <IconButton>
                            <Refresh />
                        </IconButton>
                    }
                    title="Days to completion"
                    subheader="Last updated: DATE"
                />
                <CardContent>
                    <VelocityTable />
                    <Typography component="p">
                        This is some content
                    </Typography>
                </CardContent>
            </Card>
        );

    };
}

EstimateCompletion.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(EstimateCompletion));
