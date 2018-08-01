import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import headerStyle from "../../assets/jss/material-dashboard-react/components/headerStyle.jsx";

import UserMenu from '../AppMenu/UserMenu.js';

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Menu from "@material-ui/icons/Menu";

import PropTypes from "prop-types";

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, handleDrawerToggle, pageName } = this.props;
        return (
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.container}>
                    <div className={classes.flex}>
                        <div className={classes.title}>
                            {pageName}
                        </div>
                    </div>
                    <Hidden smDown implementation="css">
                        <div style={{ display: "flex" }} >
                            <UserMenu />
                        </div>
                    </Hidden>
                    <Hidden mdUp implementation="css">
                        <IconButton
                            className={classes.appResponsive}
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerToggle}
                        >
                            <Menu />
                        </IconButton>
                    </Hidden>
                </Toolbar>
            </AppBar>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withRouter(withStyles(headerStyle)(Header)));
