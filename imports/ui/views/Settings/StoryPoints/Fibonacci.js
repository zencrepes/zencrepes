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

import TextField from '@material-ui/core/TextField';

import fibonacci from 'fibonacci-fast';

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
            value: 13,
            fibonacciError: false,
            fibonacciHelperText: '',
        }
    }

    updateValue = (value) => {
        const { setMaxPoints } = this.props;
        if (fibonacci.is(value)) {
            setMaxPoints(parseInt(value));
            this.setState({
                ['fibonacciError']: false,
                ['fibonacciHelperText']: '',
            });
        } else {
            this.setState({
                ['fibonacciError']: true,
                ['fibonacciHelperText']: 'This is not a Fibonacci number',
            });
        }
    };

    handleChange = name => event => {
        this.updateValue(event.target.value);
    };

    incFibonacci = () => {
        const { maxPoints } = this.props;
        let requestedNumber = fibonacci.get(fibonacci.find(maxPoints).index +1);
        this.updateValue(requestedNumber['number']);
    };

    decFibonacci = () => {
        const { maxPoints } = this.props;
        let requestedNumber = fibonacci.get(fibonacci.find(maxPoints).index -1);
        this.updateValue(requestedNumber['number']);
    };

    render() {
        const { classes, maxPoints } = this.props;
        const { fibonacciError, fibonacciHelperText } = this.state;
        return (
            <div className={classes.root}>
                <Card>
                    <CardContent className={classes.cardContent} >
                        <Typography className={classes.title} color="textSecondary">
                            Configure story points range
                        </Typography>
                        <Typography >
                            This app uses numbers from the Fibonacci sequence as Story Points
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.cardActions} >
                        <Typography >
                            From 1 to :
                        </Typography>
                        <Button color="primary" variant="raised" className={classes.button} onClick={this.decFibonacci}>-</Button>
                        <TextField
                            id="full-width"
                            label="To"
                            error={fibonacciError}
                            value={maxPoints}
                            disabled
                            className={classes.textField}
                            helperText={fibonacciHelperText}
                            margin="normal"
                            onChange={this.handleChange()}
                        />
                        <Button color="primary" variant="raised" className={classes.button} onClick={this.incFibonacci}>+</Button>
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
    maxPoints: state.githubLabels.maxPoints,

});

const mapDispatch = dispatch => ({
    setMaxPoints: dispatch.githubLabels.setMaxPoints,

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Fibonacci));