import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Grid from '@material-ui/core/Grid';
import { GithubCircle } from 'mdi-material-ui'

//import styles from "./styles.jsx";

const styles = theme => ({
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
});

class FooterToolbar extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, children } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static" color="default" >
                    <Toolbar>
                        <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={0}
                        >
                            <Grid item >
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    spacing={8}
                                >
                                    <Grid item xs={12} sm container>
                                        <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                                            ZenCrepes
                                        </Typography>
                                        <span>More content</span>
                                    </Grid>
                                    <Grid item >
                                        <GithubCircle />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm>
                                <span className={classes.paragraph}>
                                    Build with passion, sources on <a href="https://github.com/Fgerthoffert/github-agile-view/" >Github</a>...
                                </span>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

FooterToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FooterToolbar);
