import React from 'react';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import MenuIcon from 'material-ui-icons/Menu';
import { Settings, TableLarge, ChartLine } from 'mdi-material-ui';
import { ListItemIcon, ListItemText } from 'material-ui/List';
import {withStyles} from "material-ui/styles/index";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';


const styles = theme => ({
    menuItem: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& $primary, & $icon': {
                color: theme.palette.common.white,
            },
        },
    },
    primary: {},
    icon: {},
});

class NavigationMenu extends React.Component {
    state = {
        anchorEl: null,
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { anchorEl } = this.state;
        const { classes, theme } = this.props;

        return (
            <div>
                <MenuIcon
                    aria-owns={anchorEl ? 'simple-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    Open Menu
                </MenuIcon>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <Link to="/search">
                        <MenuItem className={classes.menuItem} onClick={this.handleClose}>
                            <ListItemIcon className={classes.icon}>
                                <TableLarge />
                            </ListItemIcon>
                            <ListItemText classes={{ primary: classes.primary }} inset primary="Search" />
                        </MenuItem>
                    </Link>
                    <MenuItem className={classes.menuItem} onClick={this.handleClose}>
                        <ListItemIcon className={classes.icon}>
                            <ChartLine />
                        </ListItemIcon>
                        <ListItemText classes={{ primary: classes.primary }} inset primary="Charts" />
                    </MenuItem>
                    <Link to="/settings">
                        <MenuItem className={classes.menuItem} onClick={this.handleClose}>
                            <ListItemIcon className={classes.icon}>
                                <Settings />
                            </ListItemIcon>
                            <ListItemText classes={{ primary: classes.primary }} inset primary="Settings" />
                        </MenuItem>
                    </Link>
                </Menu>
            </div>
        );
    }
}

NavigationMenu.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(NavigationMenu);