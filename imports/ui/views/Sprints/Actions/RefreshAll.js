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
class RefreshAll extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    refreshFull = () => {
        const { setLoadFlag, setLoadRepos } = this.props;
        setLoadRepos([]);
        setLoadFlag(true);
    };

    render() {
        const { classes } = this.props;

        return (
            <Button variant="contained" color="primary" className={classes.button} onClick={this.refreshFull}>
                <RefreshIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                All Repos
            </Button>
        )
    };
}

RefreshAll.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RefreshAll);
