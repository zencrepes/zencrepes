import React from 'react';
import PropTypes from 'prop-types';

import { connect } from "react-redux";

import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
    }
});

class ProgressBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    getIssuesValue = () => {
        const { issuesTotalCount, issuesLoadedCount } = this.props;
        return Math.round((issuesLoadedCount*100/issuesTotalCount),0);
    };

    getIssuesBuffer = () => {
        const { issuesTotalCount, issuesLoadedCountBuffer } = this.props;
        return Math.round((issuesLoadedCountBuffer*100/issuesTotalCount),0);
    };

    getLabelsValue = () => {
        const { labelsTotalCount, labelsLoadedCount } = this.props;
        return Math.round((labelsLoadedCount*100/labelsTotalCount),0);
    };

    getLabelsBuffer = () => {
        const { labelsTotalCount, labelsLoadedCountBuffer } = this.props;
        return Math.round((labelsLoadedCountBuffer*100/labelsTotalCount),0);
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <LinearProgress color="primary" variant="buffer" value={this.getIssuesValue()} valueBuffer={this.getIssuesBuffer()} />
                <LinearProgress color="secondary" variant="buffer" value={this.getLabelsValue()} valueBuffer={this.getLabelsBuffer()} />
            </div>
        );
    }
}

ProgressBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});

const mapState = state => ({
    issuesTotalCount: state.githubIssues.totalCount,
    issuesLoadedCount: state.githubIssues.loadedCount,
    issuesLoadedCountBuffer: state.githubIssues.loadedCountBuffer,

    labelsTotalCount: state.githubLabels.totalCount,
    labelsLoadedCount: state.githubLabels.loadedCount,
    labelsLoadedCountBuffer: state.githubLabels.loadedCountBuffer,

});

export default connect(mapState, mapDispatch)(withStyles(styles)(ProgressBar));