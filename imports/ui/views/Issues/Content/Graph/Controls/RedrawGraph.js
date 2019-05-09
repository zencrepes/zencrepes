import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
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

class RedrawGraph extends Component {
    constructor (props) {
        super(props);
    }

    redrawView = () => {
        const { graphNode } = this.props;
        let layout = graphNode.layout({
            name: 'cose-bilkent',
            animate: 'end',
            animationEasing: 'ease-out',
            animationDuration: 1000,
            randomize: true
        });
        layout.run();
    };

    render() {
        const { classes } = this.props;

        return (
            <Button variant="contained" color="primary" size="small" className={classes.button} onClick={this.redrawView}>
                <RefreshIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Redraw View
            </Button>
        )
    }
}

RedrawGraph.propTypes = {
    classes: PropTypes.object.isRequired,
    graphNode: PropTypes.object.isRequired,
};

const mapState = state => ({
    graphNode: state.issuesView.graphNode,
});

export default connect(mapState, null)(withStyles(styles)(RedrawGraph));