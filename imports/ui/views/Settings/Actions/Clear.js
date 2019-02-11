import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import BroomIcon from 'mdi-react/BroomIcon';

import {connect} from "react-redux";

const styles = theme => ({
    root: {
    },
    button: {
        color: '#fff',
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
});
class Clear extends Component {
    constructor (props) {
        super(props);
        this.state = {
            anchorEl: null,
        };
    }

    purgeLocal = () => {
        const { clearRepos  } = this.props;
        clearRepos();
        this.setState({ anchorEl: null });
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes, availableRepos } = this.props;
        const { anchorEl } = this.state;

        if (availableRepos.length > 0) {
            return (
                <div className={classes.root}>
                    <Button
                        aria-owns={anchorEl ? 'simple-menu' : undefined}
                        aria-haspopup="true"
                        onClick={this.handleClick}
                        className={classes.button}
                    >
                        <BroomIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                        Clear Repos
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={this.purgeLocal}>Clear local repos</MenuItem>
                    </Menu>
                </div>
            )

        } else {
            return null;
        }
    }
}

Clear.propTypes = {
    classes: PropTypes.object.isRequired,
    clearRepos: PropTypes.func.isRequired,
    availableRepos: PropTypes.array.isRequired,
};

const mapState = state => ({
    availableRepos: state.settingsView.availableRepos,
});

const mapDispatch = dispatch => ({
    clearRepos: dispatch.settingsView.clearRepos,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Clear));
