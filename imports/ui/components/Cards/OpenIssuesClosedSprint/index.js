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


import IssuesTable from './IssuesTable.js';
import QueryPicker from './QueryPicker.js';
import TextField from '@material-ui/core/TextField';

import { cfgQueries } from '../../../data/Queries.js';

const styles = theme => ({
    card: {
        maxWidth: 400,
    },
    cardHeader: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    cardContent: {
        paddingTop: 0,
        paddingBottom: 0,
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

class OpenIssuesClosedSprint extends Component {
    constructor (props) {
        super(props);
        this.state = {
            mongoFilter: {}
        };
    }

    setMongoFilter = (mongoFilter) => {
        console.log('Main - setMongoFilter: ' + JSON.stringify(mongoFilter));
        this.setState({mongoFilter: mongoFilter});
    }

    render() {
        const { classes } = this.props;
        const { mongoFilter } = this.state;
        console.log('EstimateCompletion - render()');
        return (
            <Card className={classes.card}>
                <CardHeader className={classes.cardHeader}
                    action={
                        <IconButton>
                            <Refresh />
                        </IconButton>
                    }
                    title="Open Issues in Closed Sprint"
                />
                <CardContent className={classes.cardContent}>
                    <QueryPicker setMongoFilter={this.setMongoFilter} mongoFilter={mongoFilter}/>
                    <IssuesTable mongoFilter={mongoFilter}/>
                    <i>Displays issues still opened in closed sprints</i>
                </CardContent>
            </Card>
        );

    };
}

OpenIssuesClosedSprint.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({


});

export default connect(mapState, mapDispatch)(withStyles(styles)(OpenIssuesClosedSprint));
