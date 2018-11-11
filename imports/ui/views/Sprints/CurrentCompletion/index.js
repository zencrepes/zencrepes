import React, { Component } from 'react';
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

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
    toolbarButtons: {
        flex: 1,
    },
});

class CurrentCompletion extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, issues } = this.props;

        const completedIssues = issues.filter(issue => issue.state === 'CLOSED').length;

        const completedPoints = issues
            .filter(issue => issue.state === 'CLOSED')
            .map(issue => issue.points)
            .reduce((acc, points) => acc + points, 0);
        const totalPoints = issues
            .map(issue => issue.points)
            .reduce((acc, points) => acc + points, 0);

        return (
            <Card>
                <CardHeader>
                    <span>Card Header</span>
                </CardHeader>
                <CardContent>
                    <i>Completed Issues: {completedIssues} / {issues.length}</i> <br />
                    <i>Completed Points: {completedPoints} / {totalPoints}</i>
                </CardContent>
                <CardActions>
                    <span>Card Actions</span>
                </CardActions>
            </Card>
        );
    }
}

CurrentCompletion.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(CurrentCompletion);