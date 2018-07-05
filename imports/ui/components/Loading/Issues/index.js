import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import ProgressBar from './ProgressBar.js';
import ProgressText from './ProgressText.js';

const styles = theme => ({
    root: {
    }
});

class LoadingIssues extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    cancelLoad = () => {
        console.log('cancelLoad');
        this.props.updateIssuesLoading(false);
        this.props.updateLabelsLoading(false);
    };

    render() {
        const { classes, issuesLoading, labelsLoading } = this.props;
        console.log('LoadingIssues - render()');
        if (issuesLoading || labelsLoading) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={issuesLoading}>
                    <DialogTitle id="simple-dialog-title">Importing issues & labels from GitHub</DialogTitle>
                    <DialogContent>
                        <ProgressText />
                    </DialogContent>
                    <ProgressBar />
                    <DialogActions>
                        <Button onClick={this.cancelLoad} color="primary" autoFocus>
                            Cancel Load
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        } else {
            return null;
        }

    }
}

LoadingIssues.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    issuesLoading: state.github.issuesLoading,
    labelsLoading: state.github.labelsLoading,
});

const mapDispatch = dispatch => ({
    updateIssuesLoading: dispatch.github.updateIssuesLoading,
    updateLabelsLoading: dispatch.github.updateLabelsLoading,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(LoadingIssues));
