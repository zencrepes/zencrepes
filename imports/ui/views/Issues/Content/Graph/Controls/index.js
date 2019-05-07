import React, { Component } from 'react';

import CustomCard from "../../../../../components/CustomCard/index.js";

import FetchMissing from "./FetchMissing.js";
import Explore from "./Explore.js";
import Notes from "./Notes.js";
import ResetGraph from "./ResetGraph.js";
import RedrawGraph from "./RedrawGraph.js";
import Grid from '@material-ui/core/Grid';

class Controls extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CustomCard
                headerTitle="Controls"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Controls and user input for the graph"
            >
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item>
                        <ResetGraph />
                    </Grid>
                    <Grid item>
                        <RedrawGraph />
                    </Grid>
                    <Grid item>
                        <FetchMissing />
                    </Grid>
                    <Grid item>
                        <Explore />
                    </Grid>
                    <Grid item>
                        <Notes />
                    </Grid>
                </Grid>
            </CustomCard>
        );
    }
}

export default Controls;
