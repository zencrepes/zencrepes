import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";

import RefreshIcon from '@material-ui/icons/Refresh';

const styles = theme => ({
    root: {
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
});
class Refresh extends Component {
    constructor (props) {
        super(props);
    }

    refreshRepos = () => {
        console.log('refreshQuick');
        const { setLoadFlag, setLoadRepos, repositories, milestones } = this.props;
        //Get list of repositories for current query
        console.log(milestones);
        setLoadRepos(milestones.map(milestone => milestone.repo.id));
//        setLoadRepos(repositories.map(repository => repository.id));
        setLoadFlag(true);

    };

    render() {
        const { classes } = this.props;
        return (
            <Button variant="raised" color="primary" className={classes.button} onClick={this.refreshRepos}>
                <RefreshIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Repos in Sprint
            </Button>
        )
    };
}

Refresh.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    loading: state.issuesFetch.loading,
    milestones: state.sprintsView.milestones,
    repositories: state.sprintsView.repositories,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.issuesFetch.setLoadFlag,
    setLoading: dispatch.issuesFetch.setLoading,

    setLoadRepos: dispatch.issuesFetch.setLoadRepos,
});


export default connect(mapState, mapDispatch)(withStyles(styles)(Refresh));
