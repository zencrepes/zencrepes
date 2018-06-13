import React, { Component } from 'react';
import _ from 'lodash';

import {
    withRouter
} from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import { ResponsiveBar } from '@nivo/bar'

//import ColorHash from 'color-hash';


//import {getWeekYear} from "../../../utils/velocity/index";

const styles = theme => ({
    root: {
        height: '200px'
    },
});

class RepartitionTreemap extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    /*
        TODO - Make it better, very very badly coded
        Find effortCountDays closest to current date
     */
    getRange(values) {
        let filteredValues = values.filter(v => v.issues.effort !== undefined)

        let rangeValues = [];
        effort = filteredValues.find(v => v.range === '4w');
        if (effort !== undefined) {
            if (effort.issues.effort !== undefined && effort.issues.effort !== Infinity) {
                rangeValues.push(effort);
            }
        }

        effort = filteredValues.find(v => v.range === '8w');
        if (effort !== undefined) {
            if (effort.issues.effort !== undefined && effort.issues.effort !== Infinity) {
                rangeValues.push(effort);
            }
        }
        effort = filteredValues.find(v => v.range === '12w');
        if (effort !== undefined) {
            if (effort.issues.effort !== undefined && effort.issues.effort !== Infinity) {
                rangeValues.push(effort);
            }
        }
        effort = filteredValues.find(v => v.range === 'all');
        if (effort !== undefined) {
            if (effort.issues.effort !== undefined && effort.issues.effort !== Infinity) {
                rangeValues.push(effort);
            }
        }

        if (rangeValues.length === 0) {
            return 0;
        } else {
            return rangeValues[0].issues.effort;
        }
    }

    buildDataset() {
        const {repartition} = this.props;
        let dataset = repartition.filter(v => v.velocity !== undefined);

        dataset = dataset.map((vel) => {
            let effort = Math.round(this.getRange(vel.velocity), 1);
            return {x: vel.login, y: effort};
        });

        return _.orderBy(dataset, ['y'], ['desc', 'asc']);
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
                <ResponsiveBar
                    data={this.buildDataset()}
                    keys={[
                        "y",
                    ]}
                    indexBy="x"
                    margin={{
                        "top": 0,
                        "right": 0,
                        "bottom": 27,
                        "left": 0
                    }}
                    colors="d320"
                    colorBy="x"
                    borderColor="inherit:darker(1.6)"
                    enableGridY={false}
                    enableLabel={false}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor="inherit:darker(1.6)"
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    /*
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
                    */
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

RepartitionTreemap.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    updateFromQuery: dispatch.data.updateFromQuery,
});


const mapState = state => ({
    repartition: state.repartition.repartition,
    filter: state.repartition.filter,
});


export default
    connect(mapState, mapDispatch)
    (
            withRouter
            (
                withStyles(styles)(RepartitionTreemap)
            )
    );

