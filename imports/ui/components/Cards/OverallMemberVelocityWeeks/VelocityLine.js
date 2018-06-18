import React, { Component } from 'react';
import _ from 'lodash';

import {
    withRouter
} from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import { ResponsiveLine } from '@nivo/line'

import {getWeekYear} from "../../../utils/velocity/index";

const styles = theme => ({
    root: {
        height: '300px'
    },
});

class VelocityLine extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { classes, data } = this.props;
        return (
            <div className={classes.root}>
                <ResponsiveLine
                    data={data}
                    margin={{
                        "top": 10,
                        "right": 5,
                        "bottom": 10,
                        "left": 30
                    }}
                    minY="auto"
                    stacked={true}
                    curve="natural"
                    enableGridX={false}
                    enableGridY={true}
                    colors="d320"
                    dotSize={4}
                    dotColor="inherit:darker(0.3)"
                    dotBorderWidth={0}
                    dotBorderColor="#ffffff"
                    enableDotLabel={false}
                    dotLabel="y"
                    dotLabelYOffset={-12}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    enableStackTooltip={true}
                    axisBottom={null}
                    isInteractive={true}
                    legends={[
                        {
                            "anchor": "bottom-right",
                            "direction": "column",
                            "translateX": 100,
                            "itemWidth": 80,
                            "itemHeight": 20,
                            "symbolSize": 12,
                            "symbolShape": "circle"
                        }
                    ]}
                />
            </div>
        );
    }
}

VelocityLine.propTypes = {
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
                withStyles(styles)(VelocityLine)
            )
    );

