import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import dashboardStyle from "../../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import { CalendarClock } from 'mdi-material-ui';

import PropTypes from "prop-types";
import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import CardIcon from "../../../components/Card/CardIcon";
import {ContentCopy, DateRange} from "@material-ui/icons";
import CardFooter from "../../../components/Card/CardFooter";
import CardBody from "../../../components/Card/CardBody";
import {cfgIssues} from "../../../data/Minimongo";

import RepositoriesTable from './RepositoriesTable.js';

import { getRepositoriesRepartition } from '../../../utils/repartition/index.js';

class Repositories extends Component {
    constructor(props) {
        super(props);
    }

    /*
    getAssignees = () => {
        const { sprintName } = this.props;
        let assigneesRepartition = getAssigneesRepartition(cfgIssues.find({'milestone.title':{'$in':[sprintName]}}).fetch());
        return assigneesRepartition;
    };
*/
    render() {
        const { classes, sprintName, repositories } = this.props;
        //let repositories = getRepositoriesRepartition(cfgIssues.find({'milestone.title':{'$in':[sprintName]}}).fetch());
        //console.log(repositories);
        return (
            <Card>
                <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                        <CalendarClock />
                    </CardIcon>
                    <p className={classes.cardCategory}>Repositories</p>
                    <h3 className={classes.cardTitle}>
                        {repositories.length}
                    </h3>
                </CardHeader>
                <CardBody>
                    <RepositoriesTable repositories={repositories} />
                </CardBody>
                <CardFooter stats>
                    <div className={classes.stats}>
                        TO-DO: Add button to add Assignees
                    </div>
                </CardFooter>
            </Card>
        );
    }
}

Repositories.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({
    sprintName: state.sprintPlanning.sprintName,
    repositories: state.sprintPlanning.repositories,

});

export default connect(mapState, null)(withStyles(dashboardStyle)(Repositories));
