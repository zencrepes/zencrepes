import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

import dashboardStyle from "../../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import GridItem from '../../../components/Grid/GridItem.js';
import GridContainer from '../../../components/Grid/GridContainer.js';

import FetchOrgRepos  from '../../../data/FetchOrgRepos.js';
import FetchRepo  from '../../../data/FetchRepo.js';
import FetchOrgs  from '../../../data/FetchOrgs.js';

import ScanOrgs from '../../../components/Settings/Repositories/ScanOrgs.js';
import ScanOrgRepos from '../../../components/Settings/Repositories/ScanOrgRepos.js';
import ScanRepo from '../../../components/Settings/Repositories/ScanRepo.js';

import Treeview from '../../../components/Settings/Repositories/Treeview/index.js';
import Selects from '../../../components/Settings/Load/Selects.js';

import Actions from './Actions.js';

class Repositories extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <GridContainer>
                <GridItem xs={12} sm={6} md={6}>
                    <FetchOrgs/>
                    <FetchOrgRepos/>
                    <FetchRepo/>
                    <ScanOrgs />
                    <ScanOrgRepos />
                    <ScanRepo />
                </GridItem>
                <GridItem xs={12} sm={6} md={6}>
                    <Treeview all={{}} selected={{active: true}} enable={{active: true}} disable={{active: false}} />
                </GridItem>
                <GridItem xs={12} sm={6} md={6}>
                    <Selects />
                </GridItem>
                <GridItem xs={12} sm={6} md={6}>
                    <Actions />
                </GridItem>
            </GridContainer>
        );
    }
}

Repositories.propTypes = {
    classes: PropTypes.object,
};

export default connect(null, null)(withRouter(withStyles(dashboardStyle)(Repositories)));
