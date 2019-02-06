import React, { Component } from 'react';
import { connect } from "react-redux";

import ScanOrgs from '../../../../components/Settings/Repositories/ScanOrgs.js';
import ScanOrgRepos from '../../../../components/Settings/Repositories/ScanOrgRepos.js';
import ScanRepo from '../../../../components/Settings/Repositories/ScanRepo.js';

import CustomCard from "../../../../components/CustomCard/index.js";

class Repo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CustomCard
                headerTitle="Individual Repository"
                headerFactTitle={null}
                headerFactValue={null}
            >
                <ScanRepo />
            </CustomCard>
        );
    }
}

Repo.propTypes = {

};

const mapState = state => ({
    selectedRepos: state.settingsView.selectedRepos,
});

export default connect(mapState, null)(Repo);
