import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import 'react-checkbox-tree/lib/react-checkbox-tree.css';

import {reactLocalStorage} from 'reactjs-localstorage';

const styles = {
    root: {
        margin: '10px',
        width: '100%',
    },
    card: {
        height: '300px',
        overflow: 'auto',
    },
    cardHistory: {
        overflow: 'auto',
    },
    title: {
        fontSize: 14,
    },
    details: {
        fontSize: 12,
    },
    cardContent: {
        paddingBottom: '0px',
    },
    input: {
        marginLeft: '5px',
        width: '30px',
    },
};

class Misc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            experimental: reactLocalStorage.get('enableExperimental', false),
        }
    }

    handleChange = (event, value) => {
        this.setState({experimental: value});
        reactLocalStorage.set('enableExperimental', value);
    };

    render() {
        const { classes } = this.props;
        const { experimental } = this.state;

        return (
            <div className={classes.root}>
                <Card className={classes.cardHistory}>
                    <CardContent className={classes.cardContent} >
                        <Typography className={classes.title} color="textSecondary">
                            Misc
                        </Typography>
                        <div className={classes.details} color="textPrimary">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={JSON.parse(experimental)}
                                        onChange={this.handleChange}
                                        value="enableExperimental"
                                        color="primary"
                                    />
                                }
                                label="Enable Experimental features"
                            />
                            <br />
                            <i>Please refresh your browser after changes in this section. Those features are under active developments, use at your own risk!</i><br /><br />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

Misc.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Misc);