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
        const { clearMilestones  } = this.props;
        clearMilestones();
        this.setState({ anchorEl: null });
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes, milestones } = this.props;
        const { anchorEl } = this.state;

        if (milestones.length > 0) {
            return (
                <div className={classes.root}>
                    <Button
                        aria-owns={anchorEl ? 'simple-menu' : undefined}
                        aria-haspopup="true"
                        onClick={this.handleClick}
                        className={classes.button}
                    >
                        <BroomIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                        Clear Milestones
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={this.purgeLocal}>Clear local milestones</MenuItem>
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
    clearMilestones: PropTypes.func.isRequired,
    milestones: PropTypes.array.isRequired,
};

const mapState = state => ({
    milestones: state.milestonesView.milestones,
});

const mapDispatch = dispatch => ({
    clearMilestones: dispatch.milestonesView.clearMilestones,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Clear));
