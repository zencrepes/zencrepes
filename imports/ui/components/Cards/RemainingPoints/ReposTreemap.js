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
        height: '150px'
    },
});

class ReposTreemap extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    buildDataset() {
        const {repos, defaultPoints} = this.props;
        let metric = 'points';
        if (!defaultPoints) {metric = 'count';}
        let chartData = {
            name: 'repositories'
            , color: 'hsl(67, 70%, 50%)'
            , children: repos.map((v) => {
                return {name: v.name, count: v[metric]};
            })
        };
        return chartData;
    }

    labelFormat = (params) => {
        console.log(params);
        return 'abc'
    }
    /* clickAssignee() - If a table cell is clicked, redirect the user to the search page with the parameters allowing to see the open issues
     *
     */
    clickAssignee = (params) => {
        const { filter, updateFromQuery } = this.props;

        let updatedQuery = {};
            //updatedQuery = {...filter, ...{'state':{$in:['OPEN']},'assignees.edges':{$elemMatch:{'node.login':{$in:[params.value]}}}}};
            //            {header: 'Repositories', group: 'repo.name', type: 'text', nested: false, data: [] },

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
            'repo.name': {
                header: 'Repositories',
                group: 'repo.name',
                type: 'text',
                nested: false,
                in: [params.data.name]
            }
        }};
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
                    //label="name"
                    label={(e) => _.truncate(e.name, {length: 15, omission: '...'})}
                    labelFormat=''
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

ReposTreemap.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    updateFromQuery: dispatch.data.updateFromQuery,
});


const mapState = state => ({
    repos: state.remaining.repos,
    filter: state.remaining.filter,
    defaultPoints: state.remaining.defaultPoints,
});


export default
    connect(mapState, mapDispatch)
    (
            withRouter
            (
                withStyles(styles)(ReposTreemap)
            )
    );

