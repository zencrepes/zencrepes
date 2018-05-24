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

class LoadingRepos extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    cancelLoad = () => {
        console.log('cancelLoad');
        this.props.setReposLoadFlag(false);
    };

    render() {
        const { classes, reposLoadingFlag } = this.props;
        console.log('LoadingRepos - render()');
        if (reposLoadingFlag) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={reposLoadingFlag}>
                    <DialogTitle id="simple-dialog-title">Importing Organizations and Repositories from GitHub</DialogTitle>
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

LoadingRepos.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    reposLoadingFlag: state.githubRepos.reposLoadingFlag,
});

const mapDispatch = dispatch => ({
    setReposLoadFlag: dispatch.githubRepos.setReposLoadFlag,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(LoadingRepos));
