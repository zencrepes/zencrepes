import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';

import FetchOrgRepos  from '../../../data/FetchOrgRepos.js';
import FetchRepo  from '../../../data/FetchRepo.js';
import FetchOrgs  from '../../../data/FetchOrgs.js';

import Treeview from '../../../components/Settings/Repositories/Treeview/index.js';

import ScanOrgs from '../../../components/Settings/Repositories/ScanOrgs.js';
import ScanOrgRepos from '../../../components/Settings/Repositories/ScanOrgRepos.js';
import ScanRepo from '../../../components/Settings/Repositories/ScanRepo.js';

class Step2 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <FetchOrgs/>
                <FetchOrgRepos/>
                <FetchRepo/>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={6} sm container>
                        <ScanOrgs />
                        <ScanOrgRepos />
                        <ScanRepo />
                    </Grid>
                    <Grid item xs={6} sm container>
                        <Treeview all={{}} selected={{active: true}} enable={{active: true}} disable={{active: false}} />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export default Step2;