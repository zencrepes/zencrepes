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
                                <a href="https://github.com/Fgerthoffert/github-agile-view/" className={classes.block}>
                                    On Github
                                </a>
                            </ListItem>
                        </List>
                    </div>
                    <p className={classes.right}>
                      <span>
                        All under GPLv3
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
