import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';



import { graphql } from 'react-apollo';
import { connect } from "react-redux";
import { GithubCircle, Logout } from 'mdi-material-ui'

import GET_USER_DATA from '../../../graphql/getUser.graphql';

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



class UserMenu extends React.Component {
    state = {
        anchorEl: null,
    };

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
        window.open(this.props.currentUser.url, '_blank');
    };

    logout = () => {
        Meteor.logout();
    };


    render() {
        const { classes, currentUser } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        if (currentUser !== undefined) {
            return (
                <div>
                    <IconButton
                        aria-owns={open ? 'menu-appbar' : null}
                        aria-haspopup="true"
                        onClick={this.handleMenu}
                        color="inherit"
                    >
                        <Avatar alt={currentUser.name} src={currentUser.avatarUrl} className={classes.avatar}/>
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
                            <ListItemText primary={currentUser.name} />
                        </ListItem>
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

const withData = graphql(GET_USER_DATA, {
    // destructure the default props to more explicit ones
    props: ({ data: { error, loading, user, refetch, rateLimit } }) => {
        if (loading) return { userLoading: true };
        if (error) return { hasErrors: true };

        return {
            currentUser: user,
            rateLimit: rateLimit,
            refetch,
        };
    },
    options: {
        variables: {
            login: "fgerthoffert"
        },
    },
});

UserMenu.propTypes = {
    classes: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
    rateLimit: PropTypes.object,
    updateChip: PropTypes.func,
};

const mapDispatch = dispatch => ({
    updateChip: dispatch.chip.updateChip
});

export default connect(null, mapDispatch)(withData(withStyles(styles)(UserMenu)));