import React, { Component } from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import FetchOrgRepos  from '../../../data/FetchOrgRepos.js';
import FetchRepo  from '../../../data/FetchRepo.js';
import FetchOrgs  from '../../../data/FetchOrgs.js';

import Treeview from '../../../components/Settings/Repositories/Treeview/index.js';

import Scan from '../../../components/Settings/Repositories/Scan/index.js';

import Selected from './Selected.js';

class Step2 extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { availableRepos, setLoadFlag, connectedUser, initView, setLogin, setOnSuccess } = this.props;
        if (availableRepos.length === 0) {
            setLogin(connectedUser.login);
            setOnSuccess(initView);
            setLoadFlag(true);
        }
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
                        <Scan />
                    </Grid>
                    <Grid item xs={6} sm container>
                        <Treeview />
                        <Selected />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

Step2.propTypes = {
    availableRepos: PropTypes.array.isRequired,
    connectedUser: PropTypes.object,

    setLogin: PropTypes.func.isRequired,
    setLoadFlag: PropTypes.func.isRequired,
    initView: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
};

const mapState = state => ({
    availableRepos: state.settingsView.availableRepos,
    connectedUser: state.usersView.connectedUser,
});

const mapDispatch = dispatch => ({
    setLogin: dispatch.githubFetchOrgs.setLogin,
    setLoadFlag: dispatch.githubFetchOrgs.setLoadFlag,
    setOnSuccess: dispatch.loading.setOnSuccess,
    initView: dispatch.settingsView.initView,

});

export default connect(mapState, mapDispatch)(Step2);