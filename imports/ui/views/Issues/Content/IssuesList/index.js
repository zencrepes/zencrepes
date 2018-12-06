import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import IssuesTable from '../../../../components/IssuesTable/index.js';

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


class IssuesList extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, filteredIssues, pagination } = this.props;
        console.log('render issue list');
        let dispPagination = pagination;
        if (pagination === undefined) {
            dispPagination = true;
        }
        return (
            <div className={classes.root}>
                <IssuesTable
                    pagination={dispPagination}
                    filteredIssues={filteredIssues}
                />
            </div>
        );
    }
}

IssuesList.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    filteredIssues: state.issuesView.filteredIssues,
});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesList));
