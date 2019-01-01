import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import FetchOrgRepos  from '../../../data/FetchOrgRepos.js';
import FetchRepo  from '../../../data/FetchRepo.js';
import FetchOrgs  from '../../../data/FetchOrgs.js';

import ScanOrgs from '../../../components/Settings/Repositories/ScanOrgs.js';
import ScanOrgRepos from '../../../components/Settings/Repositories/ScanOrgRepos.js';
import ScanRepo from '../../../components/Settings/Repositories/ScanRepo.js';

import Treeview from '../../../components/Settings/Repositories/Treeview/index.js';

import IssuesFetch from '../../../data/Issues/Fetch/index.js';

import Actions from './Actions.js';
import Grid from "@material-ui/core/Grid/Grid";

class Repositories extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={8}
            >
                <Grid item xs={6} sm container>
                    <FetchOrgs/>
                    <FetchOrgRepos/>
                    <FetchRepo/>
                    <ScanOrgs />
                    <ScanOrgRepos />
                    <ScanRepo />
                    <IssuesFetch />
                    <Actions />
                </Grid>
                <Grid item xs={6} sm container>
                    <Treeview all={{}} selected={{active: true}} enable={{active: true}} disable={{active: false}} />
                </Grid>
            </Grid>
        );
    }
}

Repositories.propTypes = {
};

export default connect(null, null)(withRouter(Repositories));
