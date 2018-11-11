import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import styles from "./styles.jsx";

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
                        <Typography variant="subheading" color="inherit" className={classes.grow}>
                            Build with passion, sources on <a href="https://github.com/Fgerthoffert/github-agile-view/" >Github</a>...
                        </Typography>
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
