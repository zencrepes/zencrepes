import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
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
        const { clearIssues  } = this.props;
        clearIssues();
        this.setState({ anchorEl: null });
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes, issues } = this.props;
        const { anchorEl } = this.state;

        if (issues.length > 0) {
            return (
                <div className={classes.root}>
                    <IconButton aria-label="Open" onClick={this.handleClick} className={classes.button}>
                        <BroomIcon />
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={this.purgeLocal}>Clear local issues</MenuItem>
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
    clearIssues: PropTypes.func.isRequired,
    issues: PropTypes.array.isRequired,
};

const mapState = state => ({
    issues: state.issuesView.issues,
});

const mapDispatch = dispatch => ({
    clearIssues: dispatch.issuesView.clearIssues,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Clear));
