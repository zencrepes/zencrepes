import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';


const styles = theme => ({
    root: {
    },
});
class Open extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, clearQuery } = this.props;
        return (
            <IconButton className={classes.button} aria-label="Open" onClick={clearQuery}>
                <FolderOpenIcon />
            </IconButton>
        )
    };
}

Open.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Open);
