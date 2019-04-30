import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';

import { ResponsivePie } from '@nivo/pie'

const styles = {
    root: {
        fontFamily: "consolas, sans-serif",
        textAlign: "center",
        position: "relative",
        width: 150,
        height: 150
    },
    overlay: {
        position: "absolute",
        top: 0,
        right: 5,
        bottom: 0,
        left: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        color: "#000000",
        // background: "#FFFFFF33",
        textAlign: "center",
        // This is important to preserve the chart interactivity
        pointerEvents: "none"
    },
    totalLabel: {
        fontSize: 14
    }
};

class StatsCharts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            selected,
            total,
            title,
            classes,
        } = this.props;
        const chartData = [
            {
                "id": "make",
                "label": "make",
                "value": total-selected,
                "color": "hsl(217, 100%, 99%)"
            },
            {
                "id": "sass",
                "label": "sass",
                "value": selected,
                "color": "hsl(66, 70%, 50%)"
            }
        ];

        return (
            <div className={classes.root}>
            <ResponsivePie
                data={chartData}
                margin={{
                    "top": 5,
                    "right": 5,
                    "bottom": 5,
                    "left": 5
                }}
                innerRadius={0.6}
                padAngle={0.7}
                cornerRadius={2}
                colors={{
                    "scheme": "pastel1"
                }}
                colorBy={function(e){return e.color}}
                borderWidth={1}
                borderColor="inherit:darker(0.2)"
                enableRadialLabels={false}
                radialLabelsSkipAngle={10}
                radialLabelsTextXOffset={6}
                radialLabelsTextColor="#333333"
                radialLabelsLinkOffset={0}
                radialLabelsLinkDiagonalLength={16}
                radialLabelsLinkHorizontalLength={24}
                radialLabelsLinkStrokeWidth={1}
                radialLabelsLinkColor="inherit"
                slicesLabelsSkipAngle={10}
                slicesLabelsTextColor="#333333"
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                isInteractive={false}
            />
                <div className={classes.overlay}>
                    <span className={classes.totalLabel}>{title}</span>
                </div>
            </div>
        );
    }
}

StatsCharts.propTypes = {
    classes: PropTypes.object.isRequired,
    selected: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
};

export default withStyles(styles)(StatsCharts);
