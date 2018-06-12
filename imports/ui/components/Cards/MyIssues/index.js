//https://github.com/creativetimofficial/material-dashboard-react/blob/master/src/components/Cards/RegularCard.jsx
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import cx from "classnames";
import {connect} from "react-redux";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import regularCardStyle from './regularCardStyle.jsx';

import IssuesTable from '../shared/IssuesTable.js';

import { cfgIssues } from '../../../data/Issues.js';
import {buildMongoSelector} from '../../../utils/mongo/index.js';

class MyIssues extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    getData() {
        const { filter } = this.props;
        console.log(filter);
        if (filter !== undefined) {
            let myIssuesFilter = JSON.parse(JSON.stringify(filter));
            if (myIssuesFilter['assignees'] !== undefined) {delete myIssuesFilter['assignees'];}
            myIssuesFilter['assignees'] = {header: 'Assignees', group: 'assignees', type: 'text', nested: 'login', nullName: 'UNASSIGNED', nullFilter: {'assignees.totalCount': { $eq : 0 }}, in: [Meteor.user().services.github.username] };
            console.log('Building query for filter:');
            console.log(myIssuesFilter);
            let mongoSelector = buildMongoSelector(myIssuesFilter);
            console.log(mongoSelector);
            if (cfgIssues.find(mongoSelector).count() > 0) {
                console.log(cfgIssues.find(mongoSelector).fetch());
                return cfgIssues.find(
                    mongoSelector
                    , {
                        sort: { createdAt: -1}
                        , fields: { id: 1, title: 1, url: 1, createdAt: 1, updatedAt: 1}
                        , limit: 10
                    }
                ).fetch()
            }
        }
        return [];
    }

    render() {
        const {
            classes,
            headerColor,
            plainCard,
            content,
            footer
        } = this.props;
        const plainCardClasses = cx({
            [" " + classes.cardPlain]: plainCard
        });
        const cardPlainHeaderClasses = cx({
            [" " + classes.cardPlainHeader]: plainCard
        });

        let tableData = this.getData();

        return (
            <Card className={classes.card + plainCardClasses}>
                <CardHeader
                    classes={{
                        root:
                        classes.cardHeader +
                        " " +
                        classes[headerColor + "CardHeader"] +
                        cardPlainHeaderClasses,
                        title: classes.cardTitle,
                        subheader: classes.cardSubtitle
                    }}
                    title='20 most recent issues assigned to me'
                />
                <CardContent>
                    <IssuesTable
                        tableHeaderColor="warning"
                        tableData={tableData}
                    />
                </CardContent>
                {footer !== undefined ? (
                    <CardActions className={classes.cardActions}>{footer}</CardActions>
                ) : null}
            </Card>
        )
    };
}

MyIssues.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});


const mapState = state => ({
    filter: state.velocity.filter,

});

export default connect(mapState, mapDispatch)(withStyles(regularCardStyle)(MyIssues));
