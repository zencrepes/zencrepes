import _ from 'lodash';
import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import CustomCard from "../../../../../components/CustomCard/index.js";

import Grid from '@material-ui/core/Grid';
import PropTypes from "prop-types";
import {connect} from "react-redux";

import IssueLink from "../../../../../components/Links/IssueLink/index.js";

import Button from '@material-ui/core/Button';
import DirectionsIcon from '@material-ui/icons/Directions';
import ClearIcon from '@material-ui/icons/Clear';

const styles = theme => ({
    root: {
    },
    button: {
        color: '#fff',
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
});

class Path extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, graphPathStart, graphPathEnd, buildGraphPath, clearGraphPath } = this.props;

        let nodeStart = null;
        if (!_.isEmpty(graphPathStart)) {
            nodeStart = graphPathStart.data();
        }
        let nodeEnd = null;
        if (!_.isEmpty(graphPathEnd)) {
            nodeEnd = graphPathEnd.data();
        }

        return (
            <CustomCard
                headerTitle="Draw Shortest Path"
                headerFactTitle=""
                headerFactValue=""
                headerLegend="Find the shortest path between 2 points, click on a node to start"
            >
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item>
                        <span><u>Start:</u> {nodeStart !== null && <IssueLink issue={nodeStart} /> }</span>
                    </Grid>
                    <Grid item>
                        <span><u>End:</u> {nodeEnd !== null && <IssueLink issue={nodeEnd} /> }</span>
                    </Grid>
                    <Grid container>
                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center"
                        >
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    className={classes.button}
                                    onClick={buildGraphPath}
                                    disabled={(_.isEmpty(graphPathStart) || _.isEmpty(graphPathEnd))}
                                >
                                    <DirectionsIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                                    Draw
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    className={classes.button}
                                    onClick={clearGraphPath}
                                    disabled={(_.isEmpty(graphPathStart) || _.isEmpty(graphPathEnd))}
                                >
                                    <ClearIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                                    Clear
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CustomCard>
        );
    }
}

Path.propTypes = {
    classes: PropTypes.object.isRequired,

    graphPathStart: PropTypes.object.isRequired,
    graphPathEnd: PropTypes.object.isRequired,

    buildGraphPath: PropTypes.func.isRequired,
    clearGraphPath: PropTypes.func.isRequired,
};

const mapState = state => ({
    graphPathStart: state.issuesView.graphPathStart,
    graphPathEnd: state.issuesView.graphPathEnd,
});

const mapDispatch = dispatch => ({
    buildGraphPath: dispatch.issuesView.buildGraphPath,
    clearGraphPath: dispatch.issuesView.clearGraphPath,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Path));
