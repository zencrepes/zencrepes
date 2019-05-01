import React, { Component } from 'react';
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';
import { ResponsiveBar } from "@nivo/bar";

const style = {
    root: {
        height: '150px'
    },
};


class DaysToCompletionBars extends Component {
    constructor(props) {
        super(props);
    }

    getVelocityBar(dataset) {
        const { defaultPoints } = this.props;
        let metric = 'points';
        if (!defaultPoints) {metric = 'issues';}

        if (dataset !== undefined ) {
            dataset = dataset.filter(v => v.completion[metric].effort !== Infinity);
            dataset = dataset.map((v) => {
                return {x: v.range, y: v.completion[metric].effort}
            });
            return dataset;
        } else {
            return [];
        }
    }

    render() {
        const { classes, velocity } = this.props;
        return (
            <div className={classes.root}>
                <ResponsiveBar
                    data={this.getVelocityBar(velocity)}
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
                    colors={{
                        "scheme": "pastel1"
                    }}
                    colorBy="x"
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

DaysToCompletionBars.propTypes = {
    classes: PropTypes.object.isRequired,
    velocity: PropTypes.array.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
};

export default withStyles(style)(DaysToCompletionBars);
