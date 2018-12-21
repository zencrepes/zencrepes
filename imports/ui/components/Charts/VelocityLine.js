import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import { ResponsiveLine } from '@nivo/line'

const styles = {
    root: {
        height: '75px'
    },
};

class VelocityLine extends Component {
    constructor(props) {
        super(props);
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
                        "bottom": 27,
                        "left": 5
                    }}
                    minY="auto"
                    stacked={true}
                    curve="natural"
                    enableGridX={false}
                    enableGridY={false}
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
                    axisLeft={null}
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
    data: PropTypes.array,
};

export default withStyles(styles)(VelocityLine);