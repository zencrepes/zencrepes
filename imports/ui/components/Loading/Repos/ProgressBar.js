import React from 'react';
import PropTypes from 'prop-types';

import { connect } from "react-redux";

import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: 600,
    }
});

class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getValue = () => {
        const { selectedIssues, loadedIssues } = this.props;
        return Math.round((loadedIssues*100/selectedIssues),0);
    };

    getBuffer = () => {
        const { classes, selectedIssues, loadedIssues, loadedIssuesBuffer } = this.props;
        return Math.round((loadedIssuesBuffer*100/selectedIssues),0);
    };

    render() {
        const { classes, selectedIssues, loadedIssues, loadedIssuesBuffer } = this.props;
        return (
            <div className={classes.root}>
                <LinearProgress color="secondary" variant="buffer" value={this.getValue()} valueBuffer={this.getBuffer()} />
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
    selectedIssues: state.github.selectedIssues,
    loadedIssues: state.github.loadedIssues,
    loadedIssuesBuffer: state.github.loadedIssuesBuffer,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ProgressBar));