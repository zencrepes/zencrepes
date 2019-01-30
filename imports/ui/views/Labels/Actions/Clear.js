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
        const { clearLabels  } = this.props;
        clearLabels();
        this.setState({ anchorEl: null });
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes, labels } = this.props;
        const { anchorEl } = this.state;

        if (labels.length > 0) {
            return (
                <div className={classes.root}>
                    <Button
                        aria-owns={anchorEl ? 'simple-menu' : undefined}
                        aria-haspopup="true"
                        onClick={this.handleClick}
                        className={classes.button}
                    >
                        <BroomIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                        Clear Labels
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={this.purgeLocal}>Clear local labels</MenuItem>
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
    clearLabels: PropTypes.func.isRequired,
    labels: PropTypes.array.isRequired,
};

const mapState = state => ({
    labels: state.labelsView.labels,
});

const mapDispatch = dispatch => ({
    clearLabels: dispatch.labelsView.clearLabels,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Clear));
