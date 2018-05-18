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


class IssuesLoading extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    cancelLoad = () => {
        console.log('cancelLoad');
        this.props.updateIssuesLoading(false);
    };

    render() {
        const { classes, issuesLoading } = this.props;
        console.log('IssuesLoading - render()');
        if (issuesLoading) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={issuesLoading}>
                    <DialogTitle id="simple-dialog-title">Importing issues from GitHub</DialogTitle>
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
            console.log('Return Null');
            return null;
        }

    }
}

IssuesLoading.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    issuesLoading: state.github.issuesLoading,
});

const mapDispatch = dispatch => ({
    updateIssuesLoading: dispatch.github.updateIssuesLoading,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesLoading));
