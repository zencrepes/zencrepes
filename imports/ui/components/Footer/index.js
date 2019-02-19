import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import { GithubCircle } from 'mdi-material-ui'
import {Link, withRouter} from "react-router-dom";

import GitRequests from '../Github/GitRequests.js';

const styles = {
    toolbarTitle: {
        flex: 1,
    },
    underline: {
        margin: '10px 0',
        width: '100%',
        borderWidth: '1px',
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
    link: {
        textDecoration: 'none',
        color: '#000000',
    },
};

class Footer extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static" color="default" >
                    <Toolbar>
                        <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="center"
                            spacing={8}
                        >
                            <Grid item container >
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                    spacing={8}
                                >
                                    <Grid item xs={12} sm container>
                                        <Typography variant="subtitle1" color="inherit" noWrap className={classes.toolbarTitle}>
                                            Agile project management across GitHub organizations & repositories
                                        </Typography>
                                    </Grid>
                                    <Grid item >
                                        <Link to={"/about"}>About</Link>
                                    </Grid>
                                    <Grid item >
                                        <Link to={"/terms"}>Terms & Conditions</Link>
                                    </Grid>
                                    <Grid item >
                                        <a
                                            href="https://github.com/Fgerthoffert/zencrepes/"
                                            rel="noopener noreferrer" target="_blank"
                                            className={classes.link}
                                        >
                                            <GithubCircle />
                                        </a>

                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item container >
                                <GitRequests />
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Footer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Footer))