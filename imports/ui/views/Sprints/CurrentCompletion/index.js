import React, { Component } from 'react';
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

/*
import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import CardBody from "../../../components/Card/CardBody";
 */

import Grid from '@material-ui/core/Grid';

import GaugeChart from './GaugeChart.js';

const styles = theme => ({
    root: {
        margin: '10px'
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
    toolbarButtons: {
        flex: 1,
    },
});


class CurrentCompletion extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, issues } = this.props;

        const completedIssues = issues.filter(issue => issue.state === 'CLOSED').length;

        const completedPoints = issues
            .filter(issue => issue.state === 'CLOSED')
            .map(issue => issue.points)
            .reduce((acc, points) => acc + points, 0);
        const totalPoints = issues
            .map(issue => issue.points)
            .reduce((acc, points) => acc + points, 0);

        return (
            <Card className={classes.root}>
                <CardHeader>
                    <h4 className={classes.cardTitleWhite}>Completion Status</h4>
                    <p className={classes.cardCategoryWhite}>
                        Repartition of colors amongst selected repositories
                    </p>
                </CardHeader>
                <CardContent>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        <Grid item xs={12} sm={6} md={6}>
                            <GaugeChart
                                title={"Issues Count"}
                                legend={"Issues"}
                                completed={completedIssues}
                                max={issues.length}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <GaugeChart
                                title={"Points"}
                                legend={"Points"}
                                completed={completedPoints}
                                max={totalPoints}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }
}

CurrentCompletion.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(CurrentCompletion);