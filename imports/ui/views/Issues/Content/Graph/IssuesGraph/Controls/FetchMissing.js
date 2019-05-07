import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
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

    fetchMissing = () => {
        const {
            issuesGraph,
            issuesSetStageFlag,
            issuesSetVerifFlag,
            issuesSetIssues,
            issuesSetAction,
            setOnSuccess,
            issuesUpdateView
        } = this.props;

        const partial = issuesGraph.filter((issue) => (issue.data.partial !== undefined && issue.data.partial === true)).map(node => node.data);
        setOnSuccess(issuesUpdateView);
        issuesSetIssues(partial);
        issuesSetAction('refresh');
        issuesSetStageFlag(false);
        issuesSetVerifFlag(true);

    };

    render() {
        const { classes, issuesGraph } = this.props;
        const partial = issuesGraph.filter((issue) => (issue.data.partial !== undefined && issue.data.partial === true)).map(node => node.data);

        return (
            <Button variant="contained" color="primary" size="small" className={classes.button} onClick={this.fetchMissing}>
                <CloudDownloadIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Fetch Missing ({partial.length})
            </Button>
        )
    }
}

FetchMissing.propTypes = {
    classes: PropTypes.object.isRequired,
    issuesGraph: PropTypes.array.isRequired,

    issuesSetStageFlag: PropTypes.func.isRequired,
    issuesSetVerifFlag: PropTypes.func.isRequired,
    issuesSetIssues: PropTypes.func.isRequired,
    issuesSetAction: PropTypes.func.isRequired,
    issuesUpdateView: PropTypes.func.isRequired,

    setOnSuccess: PropTypes.func.isRequired,

};

const mapState = state => ({
    issuesGraph: state.issuesView.issuesGraph,
});

const mapDispatch = dispatch => ({
    issuesSetStageFlag: dispatch.issuesEdit.setStageFlag,
    issuesSetVerifFlag: dispatch.issuesEdit.setVerifFlag,
    issuesSetIssues: dispatch.issuesEdit.setIssues,
    issuesSetAction: dispatch.issuesEdit.setAction,
    issuesUpdateView: dispatch.issuesView.updateView,

    loading: dispatch.loading.setOnSuccess,
    setOnSuccess: dispatch.loading.setOnSuccess,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(FetchMissing));