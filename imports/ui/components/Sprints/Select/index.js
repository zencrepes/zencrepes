import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from "react-redux";
import { withStyles } from 'material-ui/styles';

import {buildMongoSelector} from '../../../utils/mongo/index.js';
import _ from 'lodash';

import { cfgIssues } from '../../../data/Issues.js';


const styles = theme => ({
    root: {

    },
});

class SprintsSelect extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    getSprints() {
        const { filters } = this.props;

        console.log('getSprints');
        //let issues = cfgIssues.find(buildMongoSelector(filters)).fetch();
        //console.log(issues);
        let mongoQuery = buildMongoSelector(filters);
        if (mongoQuery['milestone.state'] !== undefined) {
            delete mongoQuery['milestone.state'];
        }
        mongoQuery['milestone.state'] = {"$in":["OPEN"]};
        let sprints = _.groupBy(cfgIssues.find(mongoQuery).fetch(), 'milestone.title');

        console.log(sprints);
        sprints = Object.keys(sprints).map((k) => {
            console.log(k);
            console.log(sprints[k]);
            return {name: k, id: sprints[k][0].milestone.id};
        });
        console.log(sprints);
    }

    render() {
        const { classes, filters } = this.props;

        this.getSprints();

        return (
            <div className={classes.root}>
                {JSON.stringify(buildMongoSelector(filters))}
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

});

export default
    connect(mapState, mapDispatch)
    (
        withStyles(styles)
        (SprintsSelect)
    );
