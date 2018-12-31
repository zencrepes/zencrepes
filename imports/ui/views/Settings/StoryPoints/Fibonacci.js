import React, { Component } from 'react';
import {connect} from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import TextField from '@material-ui/core/TextField';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import fibonacci from 'fibonacci-fast';

import { SketchPicker } from 'react-color';

import reactCSS from "reactcss";

const styles = {
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
};

class Fibonacci extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 13,
            fibonacciError: false,
            fibonacciHelperText: '',
            displayColorPicker: false,
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

    handleChange = (event) => {
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

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChangeColor = (color) => {
        const { setColor } = this.props;
        setColor(color.hex);
    };

    render() {
        const { classes, maxPoints, color } = this.props;
        const { fibonacciError, fibonacciHelperText } = this.state;

        const styles = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: `${ color }`,
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });

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
                        <Typography >
                            From 1 to :
                        </Typography>
                        <ListItem>
                            <ListItemText>
                                <Button color="primary" variant="contained" className={classes.button} onClick={this.decFibonacci}>-</Button>
                                <TextField
                                    id="full-width"
                                    label="To"
                                    error={fibonacciError}
                                    value={maxPoints}
                                    disabled
                                    className={classes.textField}
                                    helperText={fibonacciHelperText}
                                    margin="normal"
                                    onChange={this.handleChange}
                                />
                                <Button color="primary" variant="contained" className={classes.button} onClick={this.incFibonacci}>+</Button>
                            </ListItemText>
                        </ListItem>
                        <ListItem >
                            <ListItemIcon>
                                <div style={ styles.swatch } onClick={ this.handleClick }>
                                    <div style={ styles.color } />
                                </div>
                            </ListItemIcon>
                            { this.state.displayColorPicker ? <div style={ styles.popover }>
                                <div style={ styles.cover } onClick={ this.handleClose }/>
                                <SketchPicker color={ color } onChange={ this.handleChangeColor } />
                                </div> : null }
                            <ListItemText primary="Label Color" />
                        </ListItem>
                    </CardContent>
                    <CardActions className={classes.cardActions} >
                    </CardActions>
                </Card>
            </div>
        );
    }
}

Fibonacci.propTypes = {
    classes: PropTypes.object.isRequired,
    maxPoints: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,

    setMaxPoints: PropTypes.func.isRequired,
    setColor: PropTypes.func.isRequired,
};

const mapState = state => ({
    maxPoints: state.githubLabels.maxPoints,
    color: state.githubLabels.color,
});

const mapDispatch = dispatch => ({
    setMaxPoints: dispatch.githubLabels.setMaxPoints,
    setColor: dispatch.githubLabels.setColor,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Fibonacci));