import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';

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

class ResetGraph extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, resetView } = this.props;

        return (
            <Button variant="contained" color="primary" size="small" className={classes.button} onClick={resetView}>
                <ClearIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Reset View
            </Button>
        )
    }
}

ResetGraph.propTypes = {
    classes: PropTypes.object.isRequired,
    resetView: PropTypes.func.isRequired,
};

export default withStyles(styles)(ResetGraph);
