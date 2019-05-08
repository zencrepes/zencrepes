import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import ExploreIcon from '@material-ui/icons/Explore';
import {connect} from "react-redux";

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

class FetchMissing extends Component {
    constructor (props) {
        super(props);
    }

    clickIssues = () => {
        const { issuesGraph, setUpdateQueryPath, setUpdateQuery } = this.props;
        const nodesIds = issuesGraph.filter(node => node.group === 'nodes').filter(node => node.data.partial !== true).map(node => node.id);
        const query = {'id': {'$in': nodesIds}};
        setUpdateQuery(query);
        setUpdateQueryPath('/issues/list');
    };

    render() {
        const { classes, issuesGraph } = this.props;
        const nodesIds = issuesGraph.filter(node => node.group === 'nodes').filter(node => node.data.partial !== true).map(node => node.id);
        return (
            <Button variant="contained" color="primary" size="small" className={classes.button} onClick={this.clickIssues}>
                <ExploreIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                See issues list ({nodesIds.length})
            </Button>
        )
    }
}

FetchMissing.propTypes = {
    classes: PropTypes.object.isRequired,
    issuesGraph: PropTypes.array.isRequired,

    setUpdateQueryPath: PropTypes.func.isRequired,
    setUpdateQuery: PropTypes.func.isRequired,
};

const mapState = state => ({
    issuesGraph: state.issuesView.issuesGraph,
});

const mapDispatch = dispatch => ({
    setUpdateQueryPath: dispatch.global.setUpdateQueryPath,
    setUpdateQuery: dispatch.global.setUpdateQuery,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(FetchMissing));