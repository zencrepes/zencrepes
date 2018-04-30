import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";


import IssueStates from './IssueStates.js';
import IssueMilestones from './IssueMilestones.js';

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    progress: {
        margin: 10,
    },
});

class Facets extends Component {

    render() {
        const { classes, issuesLoading } = this.props;
        if (issuesLoading) {
            return (
                <div className={classes.root}>
                    <Card className={classes.card}>
                        <CardContent>
                            <CircularProgress className={classes.progress} /> Loading ...
                        </CardContent>
                    </Card>
                </div>
            );
        } else {
            return (
                <div className={classes.root}>
                    <Card className={classes.card}>
                        <CardContent>
                            <IssueStates />
                            <IssueMilestones />
                        </CardContent>
                    </Card>
                </div>
            );
        }

    }
}

Facets.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    issuesLoading: state.github.issuesLoading,
});

export default connect(mapState, null)(withStyles(styles)(Facets));
