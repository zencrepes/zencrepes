import React, { Component } from 'react';
import { ResponsivePie } from '@nivo/pie'
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core/styles/index";


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
                colors="nivo"
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
                defs={[
                    {
                        "id": "dots",
                        "type": "patternDots",
                        "background": "inherit",
                        "color": "rgba(255, 255, 255, 0.3)",
                        "size": 4,
                        "padding": 1,
                        "stagger": true
                    },
                    {
                        "id": "lines",
                        "type": "patternLines",
                        "background": "inherit",
                        "color": "rgba(255, 255, 255, 0.3)",
                        "rotation": -45,
                        "lineWidth": 6,
                        "spacing": 10
                    }
                ]}
                fill={[
                    {
                        "match": {
                            "id": "ruby"
                        },
                        "id": "dots"
                    },
                    {
                        "match": {
                            "id": "c"
                        },
                        "id": "dots"
                    },
                    {
                        "match": {
                            "id": "go"
                        },
                        "id": "dots"
                    },
                    {
                        "match": {
                            "id": "python"
                        },
                        "id": "dots"
                    },
                    {
                        "match": {
                            "id": "scala"
                        },
                        "id": "lines"
                    },
                    {
                        "match": {
                            "id": "lisp"
                        },
                        "id": "lines"
                    },
                    {
                        "match": {
                            "id": "elixir"
                        },
                        "id": "lines"
                    },
                    {
                        "match": {
                            "id": "javascript"
                        },
                        "id": "lines"
                    }
                ]}
            />
                <div className={classes.overlay}>
                    <span className={classes.totalLabel}>{title}</span>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(StatsCharts);
