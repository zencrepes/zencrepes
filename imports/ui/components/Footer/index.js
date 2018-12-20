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
import {Link, withRouter} from "react-router-dom";
import EditIcon from "@material-ui/core/SvgIcon/SvgIcon";

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

class Footer extends Component {
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
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                            spacing={8}
                        >
                            <Grid item xs={12} sm container>
                                <Typography variant="subtitle1" color="inherit" noWrap className={classes.toolbarTitle}>
                                    Agile project management across Github repositories and organizations
                                </Typography>
                            </Grid>
                            <Grid item >
                                <Link to={"/about"}>About</Link>
                            </Grid>
                            <Grid item >
                                <Link to={"/terms"}>Terms & Conditions</Link>
                            </Grid>
                            <Grid item >
                                <GithubCircle />
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

//export default withStyles(styles)(Footer);

export default withRouter(withStyles(styles)(Footer))