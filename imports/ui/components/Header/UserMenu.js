import { Meteor } from 'meteor/meteor';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Avatar from '@material-ui/core/Avatar';

import { Settings, GithubCircle, Logout } from 'mdi-material-ui'

const style = theme => ({
    root: {
    },

    appBar: {
        position: 'relative',
    },
    toolbarButtons: {
        flex: 1,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    button: {
        margin: theme.spacing.unit,
    },
});

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
        const { connectedUser, setLoadFlag, setLoadUsers } = this.props;
        if (connectedUser === null) {
            setLoadUsers([Meteor.user().services.github.username]);
            setLoadFlag(true);
        }
    }

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    openGitHub = () => {
        const { connectedUser } = this.props;
        window.open(connectedUser.url, '_blank');
    };

    logout = () => {
        Meteor.logout();
    };

    render() {
        const { classes, connectedUser } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        if (connectedUser !== null) {
            return (
                <div>
                    <IconButton
                        aria-owns={open ? 'menu-appbar' : null}
                        aria-haspopup="true"
                        onClick={this.handleMenu}
                        color="inherit"
                    >
                        <Avatar alt={connectedUser.name} src={connectedUser.avatarUrl} className={classes.avatar}/>
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
                            <ListItemText primary={connectedUser.name} />
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
    connectedUser:PropTypes.object,
    setLoadFlag:PropTypes.func,
    setLoadUsers:PropTypes.func,
};

const mapState = state => ({
    connectedUser: state.usersView.connectedUser,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.usersFetch.setLoadFlag,
    setLoadUsers: dispatch.usersFetch.setLoadUsers,
});

export default connect(mapState, mapDispatch)(withStyles(style)(UserMenu));
