import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Summary from './Summary/index.js';
import Burndown from './Burndown/index.js';
import Velocity from './Velocity/index.js';
import IssuesList from './IssuesList/index.js';

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


class IssuesContent extends Component {
    constructor (props) {
        super(props);
    }

    handleChange = (event, value) => {
        this.setState({ selectedTab: value });
    };

    render() {
        const { classes, selectedTab } = this.props;
        return (
            <div className={classes.root}>
                {{
                    0: <Summary />,
                    1: <IssuesList />,
                    2: <Velocity />,
                    3: <Burndown />,
                }[selectedTab]}
            </div>
        );
    }
}

IssuesContent.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    selectedTab: state.issuesView.selectedTab,
});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesContent));
