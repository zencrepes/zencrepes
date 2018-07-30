import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import FetchOrgRepos  from '../../../data/FetchOrgRepos.js';
import FetchRepo  from '../../../data/FetchRepo.js';
import FetchOrgs  from '../../../data/FetchOrgs.js';

import ItemGrid from '../../../components/Grid/ItemGrid.js';

import Treeview from './Treeview.js';
import Stats from './Stats.js';

import ScanOrgs from './ScanOrgs.js';
import ScanOrgRepos from './ScanOrgRepos.js';
import ScanRepo from './ScanRepo.js';

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
                <Grid container>
                    <ItemGrid xs={12} sm={6} md={6}>
                        <ScanOrgs />
                        <ScanOrgRepos />
                        <ScanRepo />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={6} md={6}>
                        <Treeview />
                    </ItemGrid>
                </Grid>
            </div>
        );
    }
}

Step2.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Step2);