import React, { Component } from 'react';

import {
    withRouter
} from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

//import { ResponsiveBar } from '@nivo/bar'

import {
    XYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalGridLines,
    LineSeries
} from 'react-vis';

import {curveCatmullRom} from 'd3-shape';


const styles = theme => ({
    root: {
        height: '150px'
    },
});

class VelocityBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { classes } = this.props;

        const data = [
            {x: 0, y: 8},
            {x: 1, y: 5},
            {x: 2, y: 4},
            {x: 3, y: 9},
            {x: 4, y: 1},
            {x: 5, y: 7},
            {x: 6, y: 6},
            {x: 7, y: 3},
            {x: 8, y: 2},
            {x: 9, y: 0}
        ];

        return (
            <div className={classes.root}>
                <XYPlot
                    width={200}
                    height={150}>
                    <HorizontalGridLines />
                    <VerticalGridLines />
                    <XAxis title="X Axis" position="start"/>
                    <YAxis title="Y Axis"/>
                    <LineSeries
                        className="first-series"
                        data={[
                            {x: 1, y: 3},
                            {x: 2, y: 5},
                            {x: 3, y: 15},
                            {x: 4, y: 12}
                        ]}/>
                    <LineSeries
                        className="second-series"
                        data={null}/>
                    <LineSeries
                        className="third-series"
                        curve={'curveMonotoneX'}
                        style={{
                            strokeDasharray: '2 2'
                        }}
                        data={[
                            {x: 1, y: 10},
                            {x: 2, y: 4},
                            {x: 3, y: 2},
                            {x: 4, y: 15}
                        ]}
                        strokeDasharray="7, 3"
                    />
                    <LineSeries
                        className="fourth-series"
                        curve={curveCatmullRom.alpha(0.5)}
                        data={[
                            {x: 1, y: 7},
                            {x: 2, y: 11},
                            {x: 3, y: 9},
                            {x: 4, y: 2}
                        ]}/>
                </XYPlot>
            </div>
        );
    }
}

VelocityBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
});


const mapState = state => ({

});


export default
connect(mapState, mapDispatch)
(
        withRouter
        (
            withStyles(styles)(VelocityBar)
        )
);

