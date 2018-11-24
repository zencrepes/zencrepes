import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';

import CustomCard from "../../../../../components/CustomCard/index.js";

import ReposTreemap from "./ReposTreemap";

const styles = theme => ({
    root: {
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
});


class RemainingWork extends Component {
    constructor (props) {
        super(props);
    }

    getDefaultRemaining() {
        const { defaultPoints, remainingWorkPoints, remainingWorkCount } = this.props;
        if (defaultPoints) {
            return remainingWorkPoints;
        } else {
            return remainingWorkCount;
        }
    };

    getDefaultRemainingTxt() {
        const { defaultPoints } = this.props;
        if (defaultPoints) {
            return 'Points';
        } else {
            return 'Issues';
        }
    };
    getDefaultRemainingTxtShrt() {
        const { defaultPoints } = this.props;
        if (defaultPoints) {
            return 'Pts';
        } else {
            return 'Tkts';
        }
    };

    render() {
        const { classes, defaultPoints, remainingWorkPoints, remainingWorkRepos, remainingWorkCount  } = this.props;

        return (
            <CustomCard
                headerTitle="Remaining work distribution"
                headerFactTitle={"Remaining " + this.getDefaultRemainingTxt()}
                headerFactValue={this.getDefaultRemaining() + " " + this.getDefaultRemainingTxtShrt()}
            >
                <ReposTreemap repos={remainingWorkRepos} defaultPoints={defaultPoints}/>
            </CustomCard>
        );
    }
}

RemainingWork.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RemainingWork);
