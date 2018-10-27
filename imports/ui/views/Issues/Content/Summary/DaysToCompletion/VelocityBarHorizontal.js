import React, { Component } from 'react';
import _ from 'lodash';

import {
    withRouter
} from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import { ResponsiveBar } from '@nivo/bar'

const styles = theme => ({
    root: {
        height: '150px'
    },
});

class VelocityBarHorizontal extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { classes, data } = this.props;

        return (
            <div className={classes.root}>
                <ResponsiveBar
                    data={data}
                    keys={[
                        "y",
                    ]}
                    indexBy="x"
                    margin={{
                        "top": 0,
                        "right": 0,
                        "bottom": 27,
                        "left": 30
                    }}
                    colors="nivo"
                    colorBy="id"
                    defs={[
                        {
                            "id": "dots",
                            "type": "patternDots",
                            "background": "inherit",
                            "color": "#38bcb2",
                            "size": 4,
                            "padding": 1,
                            "stagger": true
                        },
                        {
                            "id": "lines",
                            "type": "patternLines",
                            "background": "inherit",
                            "color": "#eed312",
                            "rotation": -45,
                            "lineWidth": 6,
                            "spacing": 10
                        }
                    ]}
                    fill={[
                        {
                            "match": {
                                "id": "fries"
                            },
                            "id": "dots"
                        },
                        {
                            "match": {
                                "id": "sandwich"
                            },
                            "id": "lines"
                        }
                    ]}
                    borderColor="inherit:darker(1.6)"
                    layout="horizontal"
                    enableGridY={false}
                    enableLabel={false}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor="inherit:darker(1.6)"
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    legends={[
                        {
                            "dataFrom": "keys",
                            "anchor": "bottom-right",
                            "direction": "column",
                            "translateX": 120,
                            "itemWidth": 100,
                            "itemHeight": 20,
                            "itemsSpacing": 2,
                            "symbolSize": 20
                        }
                    ]}
                    theme={{
                        "tooltip": {
                            "container": {
                                "fontSize": "13px"
                            }
                        },
                        "labels": {
                            "textColor": "#555"
                        }
                    }}
                />
            </div>
        );
    }
}

VelocityBarHorizontal.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(VelocityBarHorizontal);

