import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import footerStyle from "../../assets/jss/material-dashboard-react/components/footerStyle.jsx";

import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import PropTypes from "prop-types";

class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, handleDrawerToggle } = this.props;
        return (
            <footer className={classes.footer}>
                <div className={classes.container}>
                    <div className={classes.left}>
                        <List className={classes.list}>
                            <ListItem className={classes.inlineBlock}>
                                <a href="#home" className={classes.block}>
                                    Home
                                </a>
                            </ListItem>
                            <ListItem className={classes.inlineBlock}>
                                <a href="#company" className={classes.block}>
                                    Company
                                </a>
                            </ListItem>
                            <ListItem className={classes.inlineBlock}>
                                <a href="#portfolio" className={classes.block}>
                                    Portfolio
                                </a>
                            </ListItem>
                            <ListItem className={classes.inlineBlock}>
                                <a href="#blog" className={classes.block}>
                                    Blog
                                </a>
                            </ListItem>
                        </List>
                    </div>
                    <p className={classes.right}>
                      <span>
                        Some copyright notice
                      </span>
                    </p>
                </div>
            </footer>
        );
    }
}

Footer.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withRouter(withStyles(footerStyle)(Footer)));
