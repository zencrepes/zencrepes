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
class RefreshSelected extends Component {

    constructor (props) {
        super(props);
    }

    refreshQuick = () => {
        const { setLoadFlag, setLoadRepos, facets } = this.props;

        let reposFacet = facets.filter(facet => facet.key === 'repo.name')[0];
        let selectedRepos = reposFacet.values.map((repo) => repo.issues[0].repo.id);
        // TODO - Caveat: If repos facet is selected this will load all repos

        //Get list of repositories for current query
        setLoadRepos(selectedRepos);
        setLoadFlag(true);
    };

    render() {
        const { classes } = this.props;
        return (
            <Button variant="raised" color="primary" className={classes.button} onClick={this.refreshQuick}>
                <RefreshIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Selected Repos
            </Button>
        )
    };
}

RefreshSelected.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RefreshSelected);
