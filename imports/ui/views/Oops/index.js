import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import General from "../../layouts/General/index.js";
import PropTypes from "prop-types";

const styles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    appBar: {
        position: 'relative',
    },
    toolbarTitle: {
        flex: 1,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1000 + theme.spacing.unit * 3 * 2)]: {
            width: 1000,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    title: {
        fontSize: '52px',
        lineHeight: 1.3,
    },
    underline: {
        margin: '18px 0',
        width: '100px',
        borderWidth: '2px',
        borderColor: '#27A0B6',
        borderTopStyle: 'solid',
    },
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
    paragraphSmall: {
        color: '#898989',
        lineHeight: 1,
        fontSize: '14px',
        margin: '10px 0 0 10px',
        fontFamily: 'Roboto',
        fontWeight: 400,
    },
    secondTitle: {
        fontSize: '20px',
        lineHeight: 1.1,
        fontWeight: 600,
        letterSpacing: '.75px',
    },
    preText: {
        whiteSpace: 'pre-wrap',
    }
});

class Oops extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;

        return (
            <General>
                <main className={classes.layout}>
                    <h1 className={classes.title}>Ooops...</h1>
                    <div>
                        <hr className={classes.underline} />
                    </div>
                    <p className={classes.subtitle}>Sorry, it seems that ZenCrepes experienced a big glitch, please refresh your browser.</p>
                    <p className={classes.subtitle}>If the problem persists, don't hesitate to create an Issue on ZenCrepes' repo.</p>
                </main>
            </General>
        );
    }
}

Oops.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Oops);
