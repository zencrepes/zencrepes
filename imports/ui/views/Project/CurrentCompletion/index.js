import React, { Component } from 'react';
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import CustomCard from '../../../components/CustomCard/index.js';
import GaugeChart from './GaugeChart.js';

class CurrentCompletion extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { issues } = this.props;

        // Get metrics for all issues, without consideration if they involve a change of scope or not
        const completedIssues = issues.filter(issue => issue.state === 'CLOSED').length;
        const completedPoints = issues
            .filter(issue => issue.state === 'CLOSED')
            .map(issue => issue.points)
            .reduce((acc, points) => acc + points, 0);
        const totalPoints = issues
            .map(issue => issue.points)
            .reduce((acc, points) => acc + points, 0);

        return (
            <CustomCard
                headerTitle="Current Completion"
                headerFactTitle="Closed points"
                headerFactValue={completedPoints + " Pts"}
            >
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
            </CustomCard>
        );
    }
}

CurrentCompletion.propTypes = {
    issues: PropTypes.array.isRequired,
};

export default CurrentCompletion;

/*
                        <GaugeChart
                            title={"Issues Count"}
                            legend={"Issues"}
                            completed={completedIssues}
                            max={issues.length}
                        />

                        <GaugeChart
                            title={"Points"}
                            legend={"Points"}
                            completed={completedPoints}
                            max={totalPoints}
                        />
 */