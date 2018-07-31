import React, { Component } from 'react';
import _ from 'lodash';

import {
    withRouter
} from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import { ResponsiveTreeMap } from '@nivo/treemap'

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

    buildDataset() {
        const {repartition, defaultPoints} = this.props;
        let chartData = {
            name: 'assignees'
            , color: 'hsl(67, 70%, 50%)'
            , children: repartition.filter(v => (v.login !== 'UNASSIGNED' && v.open !== undefined) ).map((v) => {
                if (!defaultPoints) {
                    return {name: v.login, count: v.open.issues.length};
                } else {
                    return {name: v.login, count: v.open.points};
                }
            })
        };
        return chartData;
    }

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
    };


    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <ResponsiveTreeMap
                    root={this.buildDataset()}
                    identity="name"
                    value="count"
                    innerPadding={3}
                    outerPadding={3}
                    leavesOnly={true}
                    margin={{
                        "top": 0,
                        "right": 0,
                        "bottom": 0,
                        "left": 0
                    }}
                    label="name"
                    labelFormat=""
                    labelSkipSize={40}
                    labelTextColor="inherit:darker(1.2)"
                    colors="d320"
                    colorBy="name"
                    borderColor="inherit:darker(0.3)"
                    animate={true}
                    onClick={this.clickAssignee}
                    motionStiffness={90}
                    motionDamping={11}
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

