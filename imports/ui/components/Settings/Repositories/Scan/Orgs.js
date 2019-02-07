import React, { Component } from 'react';
import { connect } from "react-redux";

import ScanOrgs from '../../../../components/Settings/Repositories/ScanOrgs.js';
import ScanOrgRepos from '../../../../components/Settings/Repositories/ScanOrgRepos.js';
import ScanRepo from '../../../../components/Settings/Repositories/ScanRepo.js';

import CustomCard from "../../../../components/CustomCard/index.js";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import CardActions from "@material-ui/core/CardActions/CardActions";
import Button from "@material-ui/core/Button/Button";
import {withStyles} from "@material-ui/core";

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

class Orgs extends Component {
    constructor(props) {
        super(props);
    }

    reloadRepos = () => {
        const { setLoadFlag, connectedUser, setLogin, initView, setOnSuccess } = this.props;
        setLogin(connectedUser.login);
        setOnSuccess(initView);
        setLoadFlag(true);
    };


    render() {
        const { classes, loading } = this.props;

        return (
            <Card className={classes.root}>
                <CardContent className={classes.cardContent} >
                    <Typography className={classes.title} color="textSecondary">
                        Affiliated GitHub Repositories & Organizations
                    </Typography>
                    <Typography className={classes.details} color="textPrimary">
                        Scans all Github organization associated with your Github account as well as your own repositories.
                    </Typography>
                </CardContent>
                <CardActions className={classes.cardActions} >
                    <div className={classes.actionButtons} >
                        <Button color="primary" variant="contained" className={classes.button} onClick={this.reloadRepos} disabled={loading}>
                            Scan
                        </Button>
                    </div>
                </CardActions>
            </Card>
        );
    }
}

Orgs.propTypes = {

};

const mapDispatch = dispatch => ({
    setLogin: dispatch.githubFetchOrgs.setLogin,
    setLoadFlag: dispatch.githubFetchOrgs.setLoadFlag,

    initView: dispatch.settingsView.initView,
    setOnSuccess: dispatch.loading.setOnSuccess,
});


const mapState = state => ({
    connectedUser: state.usersView.connectedUser,
    loading: state.loading.loading,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Orgs));

