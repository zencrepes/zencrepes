import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import TextFacet from './TextFacet.js';

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
    constructor (props) {
        super(props);
        this.state = {
            facets: [
                {header: 'States', group: 'state', nested: false},
                {header: 'Organizations', group: 'org.name', nested: false},
                {header: 'Repositories', group: 'repo.name', nested: false},
                {header: 'Authors', group: 'author.name', nested: false},
                {header: 'Labels', group: 'labels', nested: 'name'},
                {header: 'Assignees', group: 'assignees', nested: 'name'},
                {header: 'Milestones', group: 'milestone.title', nested: false},
                {header: 'Milestones Status', group: 'milestone.state', nested: false},
            ],
        };
    }

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
                            {this.state.facets.map(value => (
                                <TextFacet data={value} key={value.header}/>
                            ))}
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
