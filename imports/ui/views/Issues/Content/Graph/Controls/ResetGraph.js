import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
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

class ResetGraph extends Component {
    constructor (props) {
        super(props);
    }

    resetView = () => {
        const { graphNode } = this.props;
        graphNode.fit();
    };

    render() {
        const { classes } = this.props;

        return (
            <Button variant="contained" color="primary" size="small" className={classes.button} onClick={this.resetView}>
                <FullscreenIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Reset View
            </Button>
        )
    }
}

ResetGraph.propTypes = {
    classes: PropTypes.object.isRequired,
    graphNode: PropTypes.object.isRequired,
};

const mapState = state => ({
    graphNode: state.issuesView.graphNode,
});

export default connect(mapState, null)(withStyles(styles)(ResetGraph));