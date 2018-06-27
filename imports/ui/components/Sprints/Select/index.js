import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from "react-redux";
import { withStyles } from 'material-ui/styles';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import {buildMongoSelector} from '../../../utils/mongo/index.js';
import { cfgIssues } from '../../../data/Issues.js';

const styles = theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 400,
    },
});

class SprintsSelect extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sprint: ""
        };
    }

    getSprints() {
        const { filters } = this.props;
        let mongoQuery = buildMongoSelector(filters);
        if (mongoQuery['milestone.state'] !== undefined) {
            delete mongoQuery['milestone.state'];
        }
        mongoQuery['milestone.state'] = {"$in":["OPEN"]};
        let sprints = _.groupBy(cfgIssues.find(mongoQuery).fetch(), 'milestone.title');

        sprints = Object.keys(sprints).map((k) => {
            return {name: k, id: sprints[k][0].milestone.id};
        });
        return sprints;
    }

    handleChange = name => event => {
        const { filters, setFilters } = this.props;

        let sprintName = event.target.value;
        this.setState({sprint: sprintName});

        //1- get all issues part of the sprint, with no filters
        let issues = cfgIssues.find({'milestone.title': {$in: [sprintName]}}).fetch();

        //2- Considering a sprint is a group of individuals, building filters based on assignees for that particular sprint
        let assignees = issues.map((issue) => {
           return issue.assignees.edges.map((assignee) => {
               return assignee.node.login;
           });
        });
        assignees = assignees.reduce((a, b) => [...a, ...b], []);
        assignees = _.uniq(assignees);
        console.log(assignees);

        let query = {
            'milestone.title': {
                header: 'Milestones',
                group: 'milestone.title',
                type: 'text',
                in: [sprintName],
                nested: false,
                nullName: 'NO MILESTONE',
                nullFilter: {'milestone': {$eq: null}},
                data: []
            },
            'assignees': {
                header: 'Assignees',
                group: 'assignees',
                type: 'text',
                in: assignees,
                nested: 'login',
                nullName: 'UNASSIGNED',
                nullFilter: {'assignees.totalCount': {$eq: 0}},
                data: []
            },
        }
        //Current Filters: {"org.name":{"header":"Organizations","group":"org.name","type":"text","nested":false,"in":["Kids First Data Resource Center","Overture"],"nullSelected":false}}

//        console.log(JSON.stringify(query));
//        console.log(JSON.stringify(buildMongoSelector(query)));

        setFilters(query); 
    };

    render() {
        const { classes, filters } = this.props;

        return (
            <div className={classes.root}>
                <TextField
                    id="select-query"
                    select
                    label="Select a Sprint"
                    className={classes.textField}
                    value={this.state.sprint}
                    onChange={this.handleChange('query')}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    margin="normal"
                >
                    {this.getSprints().map(sprint => (
                        <MenuItem key={sprint.id} value={sprint.name}>
                            {sprint.name}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
        );
    }
}

SprintsSelect.propTypes = {
    classes: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
};


const mapState = state => ({
    filters: state.queries.filters,
});

const mapDispatch = dispatch => ({
    setFilters: dispatch.queries.setFilters,
});

export default
    connect(mapState, mapDispatch)
    (
        withStyles(styles)
        (SprintsSelect)
    );
