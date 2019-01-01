import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import ReposTable from './ReposTable.js';

const styles = {
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
};

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
                            Status of points labels configuration across your repositories
                        </Typography>
                        <ReposTable />
                    </CardContent>
                </Card>
            </div>
        );
    }
}

EnabledRepos.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnabledRepos);