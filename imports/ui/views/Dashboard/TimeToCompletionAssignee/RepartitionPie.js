import React, { Component } from 'react';
import _ from 'lodash';

import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import { ResponsivePie } from '@nivo/pie'

const styles = theme => ({
    root: {
        height: '200px'
    },
});

class RepartitionTreemap extends Component {
    constructor(props) {
        super(props);
    }

    buildDataset() {
        const {repartition, defaultPoints} = this.props;
        let dataset = repartition.filter(v => v.velocity !== undefined);

        dataset = dataset.map((vel) => {
            let effortRange = vel.velocity.find(v => v.range === vel.defaultVelocity);

            let metric = 'points';
            if (!defaultPoints) {metric = 'issues';}

            //let effort = Math.round(this.getRange(vel.velocity), 1);
            let effort = Math.round(effortRange[metric].effort, 1);
            if (effort === NaN || effort === Infinity) {effort = 0;}
            //return {x: vel.login, y: effort};
            return {id: vel.login, label: vel.login, value: effort};
        });

        return _.orderBy(dataset, ['y'], ['desc', 'asc']).slice(0, 10);
    }

    /*
     getVelocityBar(dataset) {
     if (dataset.length > 0 ) {
     dataset = dataset.map((v) => {
     return {x: getWeekYear(new Date(v.weekStart)).toString(), y: v.closedCount}
     });
     return dataset;
     } else {
     return [];
     }
     }
     */

    /* clickAssignee() - If a table cell is clicked, redirect the user to the search page with the parameters allowing to see the open issues
     *
     */
    clickAssignee = (params) => {
        const { filter, updateFromQuery } = this.props;
        let updatedQuery = {};
        if (params.data.name !== 'UNASSIGNED') {
            //updatedQuery = {...filter, ...{'state':{$in:['OPEN']},'assignees.edges':{$elemMatch:{'node.login':{$in:[params.value]}}}}};
            updatedQuery = {...filter, ...{
                state: {
                    header: 'States',
                    group: 'state',
                    type: 'text',
                    nested: false,
                    in: ['OPEN'],
                    nullSelected: false
                }
                ,
                assignees: {
                    header: 'Assignees',
                    group: 'assignees',
                    type: 'text',
                    nested: 'login',
                    nullName: 'UNASSIGNED',
                    nullFilter: {'assignees.totalCount': {'$eq': 0}},
                    in: [params.data.name],
                    nullSelected: false
                }
            }};
        } else {
            updatedQuery = {...filter, ...{
                state: {
                    header: 'States',
                    group: 'state',
                    type: 'text',
                    nested: false,
                    in: ['OPEN'],
                    nullSelected: false
                }
                ,
                assignees: {
                    header: 'Assignees',
                    group: 'assignees',
                    type: 'text',
                    nested: 'login',
                    nullName: 'UNASSIGNED',
                    nullFilter: {'assignees.totalCount': {'$eq': 0}},
                    in: ['UNASSIGNED'],
                    nullSelected: false
                }
            }};
        }
        updateFromQuery(updatedQuery, this.props.history);
        //console.log(this.props);
        //this.props.history.push('/search');
    };


    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <ResponsivePie
                    data={this.buildDataset()}
                    margin={{
                        "top": 0,
                        "right": 200,
                        "bottom": 0,
                        "left": 0
                    }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    colors="d320"
                    colorBy="id"
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
                    legends={[
                        {
                            "anchor": "right",
                            "direction": "column",
                            "translateY": 0,
                            "translateX": 100,
                            "itemWidth": 100,
                            "itemHeight": 18,
                            "symbolSize": 18,
                            "symbolShape": "circle"
                        }
                    ]}
                />
            </div>
        );
    }
}

RepartitionTreemap.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    updateFromQuery: dispatch.data.updateFromQuery,
});


const mapState = state => ({
    repartition: state.repartition.repartition,
    filter: state.repartition.filter,
    defaultPoints: state.repartition.defaultPoints,

});


export default
    connect(mapState, mapDispatch)
    (
            withRouter
            (
                withStyles(styles)(RepartitionTreemap)
            )
    );

