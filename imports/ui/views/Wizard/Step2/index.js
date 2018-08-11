import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import FetchOrgRepos  from '../../../data/FetchOrgRepos.js';
import FetchRepo  from '../../../data/FetchRepo.js';
import FetchOrgs  from '../../../data/FetchOrgs.js';

import GridContainer from '../../../components/Grid/GridContainer.js';
import GridItem from '../../../components/Grid/GridItem.js';

import Treeview from '../../../components/Settings/Repositories/Treeview.js';
import Stats from '../../../components/Settings/Repositories/Stats.js';

import ScanOrgs from '../../../components/Settings/Repositories/ScanOrgs.js';
import ScanOrgRepos from '../../../components/Settings/Repositories/ScanOrgRepos.js';
import ScanRepo from '../../../components/Settings/Repositories/ScanRepo.js';

const styles = theme => ({
    root: {
    },
});

class Step2 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <FetchOrgs/>
                <FetchOrgRepos/>
                <FetchRepo/>
                <GridContainer>
                    <GridItem xs={12} sm={6} md={6}>
                        <ScanOrgs />
                        <ScanOrgRepos />
                        <ScanRepo />
                    </GridItem>
                    <GridItem xs={12} sm={6} md={6}>
                        <Treeview />
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

Step2.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Step2);