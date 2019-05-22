import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import ToolboxIcon from 'mdi-react/ToolboxIcon';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

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
class Import extends Component {
    constructor (props) {
        super(props);
        this.state = {
            anchorEl: null,
        };
    }

    importIssues = () => {
        const { setShowImportIssues } = this.props;
        setShowImportIssues(true);
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
                    <Tooltip title="Tools">
                        <IconButton aria-label="Open" onClick={this.handleClick} className={classes.button}>
                            <ToolboxIcon />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={this.importIssues}>Create issues from a TSV file</MenuItem>
                    </Menu>
                </div>
            )

        } else {
            return null;
        }
    }
}

Import.propTypes = {
    classes: PropTypes.object.isRequired,
    setShowImportIssues: PropTypes.func.isRequired,
    issues: PropTypes.array.isRequired,
};

const mapState = state => ({
    issues: state.issuesView.issues,
});

const mapDispatch = dispatch => ({
    setShowImportIssues: dispatch.issuesCreate.setShowImportIssues,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Import));
