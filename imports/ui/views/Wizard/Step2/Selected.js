import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const styles = {
    root: {
        margin: '10px',
        width: '100%',
    },
    card: {
        overflow: 'auto',
    },
    title: {
        fontSize: 14,
    },
    details: {
        fontSize: 12,
    },
    cardContent: {
        paddingBottom: '0px',
    },
};

class Selected extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, selectedRepos, issuesCountSelected} = this.props;

        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardContent className={classes.cardContent} >
                        {selectedRepos.length} Repos and {issuesCountSelected} Issues selected
                    </CardContent>
                </Card>
            </div>
        );
    }
}

Selected.propTypes = {
    classes: PropTypes.object,
    selectedRepos: PropTypes.array.isRequired,
    issuesCountSelected: PropTypes.number.isRequired,
};

const mapState = state => ({
    selectedRepos: state.settingsView.selectedRepos,
    issuesCountSelected: state.settingsView.issuesCountSelected,
});


export default connect(mapState, null)(withStyles(styles)(Selected));