import React, { Component } from 'react';
import { connect } from "react-redux";

import ScanOrgs from '../../../../components/Settings/Repositories/ScanOrgs.js';
import ScanOrgRepos from '../../../../components/Settings/Repositories/ScanOrgRepos.js';
import ScanRepo from '../../../../components/Settings/Repositories/ScanRepo.js';

import CustomCard from "../../../../components/CustomCard/index.js";

import Orgs from './Orgs.js';
import OrgRepos from './OrgRepos.js';
import Repo from './Repo.js';

class Scan extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Orgs />
                <OrgRepos />
                <Repo />
            </React.Fragment>
        );
    }
}

Scan.propTypes = {

};

const mapState = state => ({
    selectedRepos: state.settingsView.selectedRepos,
});

export default connect(mapState, null)(Scan);
