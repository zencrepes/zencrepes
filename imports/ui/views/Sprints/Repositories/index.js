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
import AddButton from './AddButton.js';
import AddRepository from './AddRepository/index.js';

import { getRepositoriesRepartition } from '../../../utils/repartition/index.js';

class Repositories extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, repositories } = this.props;
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
                    <AddRepository />
                    <RepositoriesTable repositories={repositories} />
                </CardBody>
                <CardFooter stats>
                    <div className={classes.stats}>
                        <AddButton />
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
    repositories: state.sprintsView.repositories,
});

export default connect(mapState, null)(withStyles(dashboardStyle)(Repositories));
