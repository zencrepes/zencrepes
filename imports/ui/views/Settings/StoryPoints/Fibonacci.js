import _ from 'lodash';
import React, { Component } from 'react';
import {connect} from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from "prop-types";

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

const styles = theme => ({
    root: {
        margin: '10px',
    },
    title: {
        fontSize: 14,
    },
    loading: {
        flexGrow: 1,
    },
    button: {
        width: '120px',
    },
    cardActions: {
        display: 'inline',
        width: '100%'
    },
    cardContent: {
        paddingBottom: '0px',
    },
    actionButtons: {
        textAlign: 'right',
    }
});

class Fibonacci extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 3,
        }
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { classes } = this.props;
        const { value } = this.state;
        return (
            <div className={classes.root}>
                <Card>
                    <CardContent className={classes.cardContent} >
                        <Typography className={classes.title} color="textSecondary">
                            Story points range
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.cardActions} >
                        <Input
                            label="From"
                            defaultValue="1"
                            className={classes.input}
                            inputProps={{
                                'aria-label': 'Description',
                            }}
                        />
                        <Input
                            label="To"
                            defaultValue="13"
                            className={classes.input}
                            error
                            inputProps={{
                                'aria-label': 'Description',
                            }}
                        />
                    </CardActions>
                </Card>
            </div>
        );
    }
}

Fibonacci.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({
//    loading: state.githubFetchOrgs.loading,

});

const mapDispatch = dispatch => ({
//    setLoadFlag: dispatch.githubFetchOrgs.setLoadFlag,

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Fibonacci));