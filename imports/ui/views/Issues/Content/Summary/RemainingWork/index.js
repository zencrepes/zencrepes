import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';

import dashboardStyle from "../../../../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import { Worker } from 'mdi-material-ui';
import Card from "../../../../../components/Card/Card";
import CardHeader from "../../../../../components/Card/CardHeader";
import CardIcon from "../../../../../components/Card/CardIcon";
import CardFooter from "../../../../../components/Card/CardFooter";
import CardBody from "../../../../../components/Card/CardBody";

import ReposTreemap from "./ReposTreemap";

const styles = theme => ({
    root: {
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
});


class RemainingWork extends Component {
    constructor (props) {
        super(props);
    }

    getDefaultRemaining() {
        const { defaultPoints, remainingWorkPoints, remainingWorkCount } = this.props;
        if (defaultPoints) {
            return remainingWorkPoints;
        } else {
            return remainingWorkCount;
        }
    };

    getDefaultRemainingTxt() {
        const { defaultPoints } = this.props;
        if (defaultPoints) {
            return 'Points';
        } else {
            return 'Issues';
        }
    };
    getDefaultRemainingTxtShrt() {
        const { defaultPoints } = this.props;
        if (defaultPoints) {
            return 'Pts';
        } else {
            return 'Tkts';
        }
    };

    render() {
        const { classes, defaultPoints, remainingWorkPoints, remainingWorkRepos, remainingWorkCount  } = this.props;

        return (
            <Card>
                <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                        <Worker />
                    </CardIcon>
                    <p className={classes.cardCategory}>Remaining {this.getDefaultRemainingTxt()}</p>
                    <h3 className={classes.cardTitle}>
                        {this.getDefaultRemaining()} {this.getDefaultRemainingTxtShrt()}
                    </h3>
                </CardHeader>
                <CardBody>
                    <ReposTreemap repos={remainingWorkRepos} defaultPoints={defaultPoints}/>
                </CardBody>
                <CardFooter stats>
                    <div className={classes.stats}>
                        Work repartition by repository
                    </div>
                </CardFooter>
            </Card>
        );
    }
}

RemainingWork.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(RemainingWork);
