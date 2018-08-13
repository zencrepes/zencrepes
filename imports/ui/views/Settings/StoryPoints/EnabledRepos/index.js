import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import ReposTable from './ReposTable.js';

const styles = theme => ({
    root: {
        margin: '10px',
    },
    title: {
        fontSize: 14,
    },
    loading: {
        flexGrow: 1,
    },
    button: {
        width: '120px',
    },
    cardActions: {
        display: 'inline',
        width: '100%'
    },
    cardContent: {
        paddingBottom: '0px',
    },
    actionButtons: {
        textAlign: 'right',
    }
});

class EnabledRepos extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Card>
                    <CardContent className={classes.cardContent} >
                        <Typography className={classes.title} color="textSecondary">
                            Status of points configuration across your repositories
                        </Typography>
                        <ReposTable />
                    </CardContent>
                </Card>
            </div>
        );
    }
}

EnabledRepos.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    //maxPoints: state.githubLabels.maxPoints,

});

const mapDispatch = dispatch => ({
    //setMaxPoints: dispatch.githubLabels.setMaxPoints,

});

export default connect(mapState, mapDispatch)(withStyles(styles)(EnabledRepos));