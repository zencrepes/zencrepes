import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Avatar from '@material-ui/core/Avatar';

import { graphql } from 'react-apollo';
import { Query } from 'react-apollo';
import { withApollo } from 'react-apollo';

import { Settings, GithubCircle, Logout } from 'mdi-material-ui'

import GET_USER_DATA from '../../../graphql/getUser.graphql';

import styles from "./styles.jsx";

/*
const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
};
*/

class UserMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            avatarUrl: null,
            name: null,
            login: null,
            url: null,
        }
    }

    componentDidMount() {
        this.fetchUserData();
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        const { rateLimit, updateChip } = nextProps;
        updateChip(rateLimit);
        return null;
    }

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    openGitHub = () => {
        window.open(this.state.url, '_blank');
    };

    logout = () => {
        Meteor.logout();
    };

    fetchUserData = async () => {
        const { client, updateChip } = this.props;

        let data = await client.query({
            query: GET_USER_DATA,
            variables: {login: Meteor.user().services.github.username},
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        });

        updateChip(data.data.rateLimit);

        this.setState({
            avatarUrl: data.data.user.avatarUrl,
            name: data.data.user.name,
            login: data.data.user.login,
            url: data.data.user.url,
        });

    }

    render() {
        const { classes } = this.props;
        const { anchorEl, login, avatarUrl, name, url } = this.state;
        const open = Boolean(anchorEl);
        if (login !== null) {
            return (
                <div>
                    <IconButton
                        aria-owns={open ? 'menu-appbar' : null}
                        aria-haspopup="true"
                        onClick={this.handleMenu}
                        color="inherit"
                    >
                        <Avatar alt={name} src={avatarUrl} className={classes.avatar}/>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={open}
                        onClose={this.handleClose}
                    >
                        <ListItem onClick={this.openGitHub} button>
                            <ListItemIcon>
                                <GithubCircle />
                            </ListItemIcon>
                            <ListItemText primary={name} />
                        </ListItem>
                        <NavLink
                            to="/settings"
                            className={classes.item}
                            activeClassName="active"
                            key={"settings"}
                        >
                            <ListItem button className={classes.itemLink}>
                                <ListItemIcon className={classes.itemIcon}>
                                    <Settings />
                                </ListItemIcon>
                                <ListItemText
                                    primary={"Settings"}
                                    className={classes.itemText}
                                    disableTypography={true}
                                />
                            </ListItem>
                        </NavLink>
                        <ListItem onClick={this.logout} button>
                            <ListItemIcon>
                                <Logout />
                            </ListItemIcon>
                            <ListItemText primary="Log Out" />
                        </ListItem>
                    </Menu>
                </div>
            );
        } else {
            return null;
        }

    }
}

UserMenu.propTypes = {
    classes: PropTypes.object.isRequired,
    updateChip: PropTypes.func,
};

const mapDispatch = dispatch => ({
    updateChip: dispatch.chip.updateChip
});

export default connect(null, mapDispatch)(withApollo(withStyles(styles)(UserMenu)));
