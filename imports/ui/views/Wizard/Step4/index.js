import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import PropTypes from "prop-types";

const styles = {
    subtitle: {
        fontSize: '20px',
        fontFamily: 'Roboto',
        fontWeight: 400,
        lineHeight: 1.5,
    },
    paragraph: {
        color: '#898989',
        lineHeight: 1.75,
        fontSize: '16px',
        margin: '0 0 10px',
        fontFamily: 'Roboto',
        fontWeight: 400,
    },
};

class Step4 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <p className={classes.subtitle}>Estimate and track complexity</p>
                <p className={classes.paragraph}>
                    GitHub doesn't have a built-in feature to track complexity. Some teams use T-Shirt sizes (S, M, XL, ...), others use points (1, 2, 3, 5...). <br />
                    ZenCrepes uses points for its estimates through labels. Simply attach a label using the format SP:X with X being points to your issues.
                </p>
                <p className={classes.subtitle}>Understand your metrics</p>
                <p className={classes.paragraph}>
                    ZenCrepes provide various metrics and data points, those are <b>NOT</b> indisputable truth.
                    Understand what you're asking the system to provide, what are the implications of this request.
                    ZenCrepes data should mostly be seen as one of the many input for decision making, not the only one.
                </p>
                <p className={classes.subtitle}>ZenCrepes is opinionated</p>
                <p className={classes.paragraph}>
                    Finally, understand that ZenCrepes is opinionated in its implementation.
                    Some of the data it's going to show might not work in your context or not reflect team's workflow.
                </p>
            </React.Fragment>
        );
    }
}

Step4.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Step4);