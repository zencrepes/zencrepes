import React, { Component } from 'react';

import Grid from "@material-ui/core/Grid/Grid";

import FetchOrgRepos  from '../../../data/FetchOrgRepos.js';
import FetchRepo  from '../../../data/FetchRepo.js';
import FetchOrgs  from '../../../data/FetchOrgs.js';

import Treeview from '../../../components/Settings/Repositories/Treeview/index.js';
import DataFetch from '../../../components/Settings/Repositories/DataFetch/index.js';

import IssuesFetch from '../../../data/Issues/Fetch/index.js';

import Stats from './Stats.js';
import Scan from "../../../components/Settings/Repositories/Scan/index.js";

import Misc from './Misc/index.js';

class Repositories extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <React.Fragment>
                <FetchOrgs/>
                <FetchOrgRepos/>
                <FetchRepo/>
                <IssuesFetch />
                <Stats />
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={4} sm container>
                        <Scan />
                    </Grid>
                    <Grid item xs={4} sm container>
                        <Treeview />
                    </Grid>
                    <Grid item xs={4} sm container>
                        <DataFetch />
                        <Misc />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export default Repositories;
