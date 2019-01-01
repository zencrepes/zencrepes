import React, { Component } from 'react';
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Grid from '@material-ui/core/Grid';

const styles = {
    root: {
        margin: '10px',
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderWidth: '0px 1px 1px',
        borderStyle: 'solid solid solid',
        borderColor: 'rgb(169, 173, 192) rgb(169, 173, 192) rgb(169, 173, 192)',
        borderImage: 'initial',
        borderTop: 0,
        padding: '0px 10px',
    },
    header: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    liner: {
        width: 'calc(100% + 22px)',
        marginLeft: '-11px',
        height: 6,
        backgroundImage: 'linear-gradient(to right, rgb(43, 56, 143), rgb(92, 107, 192) 51%, rgb(121, 134, 203))',
    },
    headerTitle: {
        color: 'rgb(43, 56, 143)',
        fontWeight: 500,
        lineHeight: 0.71,
        letterSpacing: 0.4,
        fontFamily: 'Montserrat, sans-serif',
        fontSize: 24,
        margin: '8px 0px 0px',
        padding: '0px',
        textDecoration: 'none',
    },
    headerFactTitle: {
        paddingRight: 5,
        textAlign: 'right',
        color: '#999999',
        fontSize: 14,
    },
    headerFactValue: {
        textAlign: 'right',
        color: '#3C4858',
        fontSize: 18,
        fontWeight: 300,
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    },
    mainContent: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 5
    },
};

class CustomCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, headerTitle, headerIcon, headerFactTitle, headerFactValue, children } = this.props;
        return (
            <Card className={classes.root}>
                <div className={classes.liner}></div>
                <CardContent className={classes.header}>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        {headerIcon !== undefined &&
                            <Grid item>
                                {headerIcon}
                            </Grid>
                        }
                        <Grid item xs={12} sm container>
                            <h2 className={classes.headerTitle}>{headerTitle}</h2>
                        </Grid>
                        {headerFactTitle !== undefined &&
                            <Grid item className={classes.headerFact}>
                                <div className={classes.headerFactTitle}>{headerFactTitle}</div>
                                <div className={classes.headerFactValue}>{headerFactValue}</div>
                            </Grid>
                        }
                    </Grid>
                </CardContent>
                <CardContent className={classes.mainContent}>
                    {children}
                </CardContent>
            </Card>
        );
    }
}

CustomCard.propTypes = {
    classes: PropTypes.object,
    headerTitle: PropTypes.string,
    headerIcon: PropTypes.object,
    headerFactTitle: PropTypes.string,
    headerFactValue: PropTypes.string,
    children: PropTypes.object,
};

export default withStyles(styles)(CustomCard);