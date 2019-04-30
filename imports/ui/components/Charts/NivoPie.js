import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { ResponsivePie } from '@nivo/pie';
import PropTypes from "prop-types";

const style = {
    root: {
        height: '200px'
    },
};


class PieChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, dataset } = this.props;

        return (
            <div className={classes.root}>
                <ResponsivePie
                    data={dataset.map((cat) => {
                        return {
                            id: cat.name,
                            label: cat.name,
                            value: cat.issues.length,
                            color: cat.color,
                            issues: cat.issues,
                        }
                    })}
                    margin={{
                        "top": 5,
                        "right": 0,
                        "bottom": 60,
                        "left": 0
                    }}
                    innerRadius={0}
                    padAngle={0.7}
                    cornerRadius={0}
                    colors={{
                        "scheme": "paired"
                    }}
                    borderWidth={1}
                    borderColor={{
                        "from": "color",
                        "modifiers": [
                            [
                                "darker",
                                0.2
                            ]
                        ]
                    }}
                    enableRadialLabels={false}
                    radialLabelsSkipAngle={10}
                    radialLabelsTextXOffset={6}
                    radialLabelsTextColor="#333333"
                    radialLabelsLinkOffset={0}
                    radialLabelsLinkDiagonalLength={16}
                    radialLabelsLinkHorizontalLength={24}
                    radialLabelsLinkStrokeWidth={1}
                    radialLabelsLinkColor={{
                        "from": "color"
                    }}
                    slicesLabelsSkipAngle={10}
                    slicesLabelsTextColor="#333333"
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    legends={[
                        {
                            "anchor": "bottom",
                            "direction": "row",
                            "translateY": 56,
                            "itemWidth": 100,
                            "itemHeight": 18,
                            "itemTextColor": "#999",
                            "symbolSize": 18,
                            "symbolShape": "circle",
                            "effects": [
                                {
                                    "on": "hover",
                                    "style": {
                                        "itemTextColor": "#000"
                                    }
                                }
                            ]
                        }
                    ]}
                />
            </div>
        );
    }
}

PieChart.propTypes = {
    classes: PropTypes.object.isRequired,
    dataset: PropTypes.array,

};

export default withStyles(style)(PieChart);
