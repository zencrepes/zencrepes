import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { connect } from "react-redux";
import { GithubCircle } from 'mdi-material-ui'
import { Link } from 'react-router-dom';

import { ResponsiveLine } from '@nivo/line'

import { cfgQueries } from '../../../data/Queries.js';

const styles = theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        //width: 700,
    },
    row: {
        height: 24,
    },
});


class VelocityChart extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const { classes, queriesList } = this.props;
        const { columns, pageSize, pageSizes, currentPage, editingStateColumnExtensions } = this.state;



        return (
            <div className={classes.root}>
                <ResponsiveLine
                    data={[
                    {
                        "id": "whisky",
                        "color": "hsl(75, 70%, 50%)",
                        "data": [
                    {
                        "color": "hsl(202, 70%, 50%)",
                        "x": "VC",
                        "y": 54
                    },
                    {
                        "color": "hsl(190, 70%, 50%)",
                        "x": "SL",
                        "y": 47
                    },
                    {
                        "color": "hsl(103, 70%, 50%)",
                        "x": "BE",
                        "y": 57
                    },
                    {
                        "color": "hsl(288, 70%, 50%)",
                        "x": "YE",
                        "y": 19
                    },
                    {
                        "color": "hsl(205, 70%, 50%)",
                        "x": "BM",
                        "y": 35
                    },
                    {
                        "color": "hsl(277, 70%, 50%)",
                        "x": "SX",
                        "y": 37
                    },
                    {
                        "color": "hsl(236, 70%, 50%)",
                        "x": "SS",
                        "y": 39
                    },
                    {
                        "color": "hsl(237, 70%, 50%)",
                        "x": "NF",
                        "y": 36
                    },
                    {
                        "color": "hsl(4, 70%, 50%)",
                        "x": "GN",
                        "y": 31
                    }
                        ]
                    }]}
                    margin={{
                        "top": 50,
                        "right": 110,
                        "bottom": 50,
                        "left": 60
                    }}
                    minY="auto"
                    stacked={true}
                    axisBottom={{
                        "orient": "bottom",
                        "tickSize": 5,
                        "tickPadding": 5,
                        "tickRotation": 0,
                        "legend": "country code",
                        "legendOffset": 36,
                        "legendPosition": "center"
                    }}
                    axisLeft={{
                        "orient": "left",
                        "tickSize": 5,
                        "tickPadding": 5,
                        "tickRotation": 0,
                        "legend": "count",
                        "legendOffset": -40,
                        "legendPosition": "center"
                    }}
                    dotSize={10}
                    dotColor="inherit:darker(0.3)"
                    dotBorderWidth={2}
                    dotBorderColor="#ffffff"
                    enableDotLabel={true}
                    dotLabel="y"
                    dotLabelYOffset={-12}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
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

VelocityChart.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});


const mapState = state => ({

});


export default
    connect(mapState, mapDispatch)
    (
        withTracker(() => {return {queriesList: cfgQueries.find({}).fetch()}})
        (
            withStyles(styles)(VelocityChart)
        )
    );

