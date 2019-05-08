import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

import {connect} from "react-redux";

const styles = {
    root: {
        width: 200,
    },
    slider: {
        padding: '22px 0px',
    },
};

class DistanceSlider extends Component {
    constructor (props) {
        super(props);
    }

    handleChange = (event, value) => {
        const { updateGraphDistance } = this.props;
        updateGraphDistance(value);
    };

    render() {
        const { classes, maxDistanceGraph, maxDistanceGraphCeiling } = this.props;

        return (
            <div className={classes.root}>
            <Typography id="label">Max Distance: {maxDistanceGraph}</Typography>
            <Slider
                classes={{ container: classes.slider }}
                value={maxDistanceGraph}
                min={0}
                max={maxDistanceGraphCeiling}
                step={1}
                onChange={this.handleChange}
            />
            </div>
        )
    }
}

DistanceSlider.propTypes = {
    classes: PropTypes.object.isRequired,
    maxDistanceGraph: PropTypes.number.isRequired,
    maxDistanceGraphCeiling: PropTypes.number.isRequired,
    updateGraphDistance: PropTypes.func.isRequired,
};

const mapState = state => ({
    maxDistanceGraph: state.issuesView.maxDistanceGraph,
    maxDistanceGraphCeiling: state.issuesView.maxDistanceGraphCeiling,
});

const mapDispatch = dispatch => ({
    updateGraphDistance: dispatch.issuesView.updateGraphDistance,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(DistanceSlider));