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
        const { clearPullrequests  } = this.props;
        clearPullrequests();
        this.setState({ anchorEl: null });
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes, pullrequests } = this.props;
        const { anchorEl } = this.state;

        if (pullrequests.length > 0) {
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
                        <MenuItem onClick={this.purgeLocal}>Clear local pullrequests</MenuItem>
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
    clearPullrequests: PropTypes.func.isRequired,
    pullrequests: PropTypes.array.isRequired,
};

const mapState = state => ({
    pullrequests: state.pullrequestsView.pullrequests,
});

const mapDispatch = dispatch => ({
    clearPullrequests: dispatch.pullrequestsView.clearPullrequests,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Clear));
