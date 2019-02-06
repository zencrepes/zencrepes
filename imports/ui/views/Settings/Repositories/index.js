import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import Grid from "@material-ui/core/Grid/Grid";

import FetchOrgRepos  from '../../../data/FetchOrgRepos.js';
import FetchRepo  from '../../../data/FetchRepo.js';
import FetchOrgs  from '../../../data/FetchOrgs.js';

import Treeview from '../../../components/Settings/Repositories/Treeview/index.js';

import IssuesFetch from '../../../data/Issues/Fetch/index.js';

import CustomCard from "../../../components/CustomCard/index.js";

import Stats from './Stats.js';
import Scan from './Scan/index.js';

class Repositories extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            selectedRepos
        } = this.props;

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
                    <Grid item xs={6} sm container>
                        <Scan />
                    </Grid>
                    <Grid item xs={6} sm container>
                        <CustomCard
                            headerTitle="Select repositories to load from"
                            headerFactTitle="Selected repos"
                            headerFactValue={selectedRepos.length}
                        >
                            <Treeview all={{}} selected={{active: true}} enable={{active: true}} disable={{active: false}} />
                        </CustomCard>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

Repositories.propTypes = {
};

const mapState = state => ({
    selectedRepos: state.settingsView.selectedRepos,
});

export default connect(mapState, null)(Repositories);
