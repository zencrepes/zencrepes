import React, { Component } from 'react';
import { connect } from "react-redux";

import ScanOrgs from '../../../../components/Settings/Repositories/ScanOrgs.js';
import ScanOrgRepos from '../../../../components/Settings/Repositories/ScanOrgRepos.js';
import ScanRepo from '../../../../components/Settings/Repositories/ScanRepo.js';

import CustomCard from "../../../../components/CustomCard/index.js";
import {withStyles} from "@material-ui/core";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import CardActions from "@material-ui/core/CardActions/CardActions";
import Button from "@material-ui/core/Button/Button";

const styles = {
    root: {
        width: '100%',
        margin: '10px',
    },
    title: {
        fontSize: 14,
    },
    details: {
        fontSize: 12,
    },
};

class OrgRepos extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, loading, loadSuccess, loadedOrgs, loadedRepos } = this.props;


        return (


            <CustomCard
                headerTitle="GitHub Organization"
                headerFactTitle={null}
                headerFactValue={null}
                className={classes.root}
            >
                <ScanOrgRepos />
            </CustomCard>


        );
    }
}

/*

            <CustomCard
                headerTitle="GitHub Organization"
                headerFactTitle={null}
                headerFactValue={null}
                className={classes.root}
            >
                <ScanOrgRepos />
            </CustomCard>
 */

OrgRepos.propTypes = {

};

const mapState = state => ({
    selectedRepos: state.settingsView.selectedRepos,
});

export default connect(mapState, null)(withStyles(styles)(OrgRepos));
